import path from 'path';
import shell from 'shelljs';
import fs from 'fs-extra';

import { mergeNewAndExistingBuildAssets, getAllFilesRecursive } from './helper';
import { ChildProcess } from 'child_process';

interface IDeployEnvironments<T> {
  master: T;
  beta: T;
  production: T;
}

const {
  HOME,
  BRANCH,
  PULL_REQUEST,
  COMMIT_MESSAGE,
  SITE_NAME,
  PACKAGE_LOCATION,
} = process.env; // from azure-pipelines.  Also includes additional environmental variables of the form
// DEPLOYMENT_USERNAME_<SITE_NAME (all uppercase and with underscores)>_<DEPLOYMENT_SLOT_IF_ANY)
// and same thing for DEPLOYMENT_PASSWORD_***.
// E.g.,:  DEPLOYMENT_USERNAME_SCRIPT_LAB_REACT_STORYBOOK_ALPHA, and DEPLOYMENT_PASSWORD_SCRIPT_LAB_REACT_STORYBOOK_ALPHA

// Make any unhandled rejections terminate Node (rather than having it quit with a mere warning)
process.on('unhandledRejection', error => {
  throw error;
});

if (!BRANCH) {
  exit(
    'Expecting to run the deploy script from within Azure-Pipelines ' +
      '(or at least, with all environmental variables set up). Exiting.',
  );
}

/* If running inside of a pull request then skip deploy.
   (Note, this is actually a triple safe-guard, as azure-pipelines.yaml already will not call deploy for pull requests.
   And in any case, pull requests don't get secret variables like username or password
   passed to them by the CI tools, so the deploy would abort at any rate).
 */
if (PULL_REQUEST !== 'false') {
  exit('Skipping deploy for pull requests');
}

const DEPLOYMENT_SLOTS_DICTIONARY: IDeployEnvironments<string> = {
  master: 'alpha',
  beta: 'beta',
  production: 'staging',
};

if (!DEPLOYMENT_SLOTS_DICTIONARY[BRANCH]) {
  exit('Invalid branch name. Skipping deploy.');
}

const BUILD_DIRECTORY = path.join(PACKAGE_LOCATION, 'build');
if (!shell.test('-d', BUILD_DIRECTORY)) {
  exit('ERROR: No build directory found!');
}

(async () => {
  const PREVIOUS_BUILD_DIRECTORIES: string[] = await fetchPreviousBuildsFromLiveSite();

  const FINAL_OUTPUT_DIRECTORY = path.join(HOME, 'final_output');
  if (fs.existsSync(FINAL_OUTPUT_DIRECTORY)) {
    fs.removeSync(FINAL_OUTPUT_DIRECTORY);
  }

  const DEPLOYMENT_LOG_FILENAME = new Date().toISOString().replace(/\:/g, '_') + '.txt';
  mergeNewAndExistingBuildAssets({
    BUILD_DIRECTORY,
    PREVIOUS_BUILD_DIRECTORIES,
    FINAL_OUTPUT_DIRECTORY,
    DEPLOYMENT_LOG_FILENAME,
  });

  deploy(FINAL_OUTPUT_DIRECTORY, DEPLOYMENT_SLOTS_DICTIONARY[BRANCH]);

  exit(
    `Deployment to ${SITE_NAME}-${DEPLOYMENT_SLOTS_DICTIONARY[BRANCH]} completed!`,
  );
})();

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

async function fetchPreviousBuildsFromLiveSite(): Promise<string[]> {
  // Not: If deploying to production, production has an extra layer of a "staging" slot.
  // So, make sure to copy both from the staging slot and actual direct production.
  // Order shouldn't matter too much (any file that's going to get overridden will get
  // overridden by the newly-build assets), but the "staging" slot will be older
  // than what's actually in production (since the staging and prod gets swapped out),
  // so put the slot first, and the production assets second.

  const spec: Array<{ friendlyName: string; urlWithUsernameAndPassword: string }> = [
    {
      friendlyName: 'current_slot',
      urlWithUsernameAndPassword: getGitUrlWithUsernameAndPassword(
        DEPLOYMENT_SLOTS_DICTIONARY[BRANCH],
      ),
    },
    BRANCH === 'production'
      ? {
          friendlyName: 'production',
          urlWithUsernameAndPassword: getGitUrlWithUsernameAndPassword(null),
        }
      : null,
  ];

  return Promise.all(spec.filter(item => item).map(item => cloneExistingRepo(item)));
}

async function cloneExistingRepo(source: {
  friendlyName: string;
  urlWithUsernameAndPassword: string;
}): Promise<string> {
  const sanitizedFriendlyName = superSanitize(source.friendlyName);
  const allPreviousBuildsFolder = path.join(HOME, 'previous_builds');
  const fullFolderPath = path.join(allPreviousBuildsFolder, sanitizedFriendlyName);

  if (!fs.existsSync(allPreviousBuildsFolder)) {
    fs.mkdirSync(allPreviousBuildsFolder);
  }

  console.log(
    `Fetching existing assets from "${source.friendlyName}" and copying them into "${fullFolderPath}"`,
  );
  console.log('Start: ' + new Date().toString());

  shell.pushd(allPreviousBuildsFolder);

  // For some reason, seems to need to be an ASYNCHRONOUS command, or else was
  //    moving on with the logic before finishing!
  await new Promise((resolve, reject) => {
    const process = shell.exec(
      `git clone ${source.urlWithUsernameAndPassword} ${sanitizedFriendlyName}`,
      {
        async: true,
      },
    ) as ChildProcess;
    process.on('error', error => reject(error));
    process.on('message', message => console.log(message));
    process.on('exit', (code: number, signal: string) => {
      console.log('Done: ' + new Date().toString());
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('Unexpected error: ' + signal));
      }
    });
  });

  shell.popd();

  console.log(`The following files were cloned into "${fullFolderPath}":`);
  getAllFilesRecursive(fullFolderPath).forEach(item => console.log(' - ' + item));

  return fullFolderPath;
}

function deploy(path: string, deploymentSlot: string) {
  const commitMessageSanitized = superSanitize(COMMIT_MESSAGE);

  shell.pushd(path);

  shell.exec('git init');

  shell.exec('git config --add user.name "Azure Pipelines"');
  shell.exec('git config --add user.email "offMakerTeam@microsoft.com"');

  shell.exec('git add -A');
  shell.exec(`git commit -m "${commitMessageSanitized}"`);

  shell.exec(
    `git push ${getGitUrlWithUsernameAndPassword(
      deploymentSlot,
    )} -f -u HEAD:refs/heads/master`,
  );

  shell.popd();
}

function getGitUrlWithUsernameAndPassword(deploymentSlotIfAny: string | null) {
  return [
    `https://`,
    `${fetchUsername()}:${fetchPassword()}`,
    `@`,
    getSiteNameWithPossibleSlotSuffix('-'),
    `.scm.azurewebsites.net:443/${SITE_NAME}.git`,
  ].join('');

  function fetchUsername() {
    // In Azure Websites, the site name is something like:
    //   "$script-lab-react-runner__alpha"
    //   I.e., just the "$" sign followed by the site name and possible slot suffix (prepended by "__").
    //   However, to avoid escaping due to the "$" sign, also add a slash before it (and double it in code)
    return '\\$' + getSiteNameWithPossibleSlotSuffix('__');
  }

  function fetchPassword() {
    return process.env[determineKey()];

    function determineKey() {
      return (
        `DEPLOYMENT_PASSWORD_` +
        getSiteNameWithPossibleSlotSuffix('_')
          .toUpperCase()
          .replace(/\-/g, '_')
      );
    }
  }

  function getSiteNameWithPossibleSlotSuffix(separator: string) {
    return SITE_NAME + (deploymentSlotIfAny ? separator + deploymentSlotIfAny : '');
  }
}

function superSanitize(text: string) {
  return text.replace(/\W/g, '_');
}

function exit(reason: string, abort?: boolean) {
  if (reason) {
    abort ? console.error(reason) : console.log(reason);
  }

  return abort ? process.exit(1) : process.exit(0);
}

// cSpell:ignore pushd, popd
