// cSpell:ignore pushd, popd

import path from 'path';
import shell from 'shelljs';
import fs from 'fs-extra';
import { partition } from 'lodash';

interface IDeployEnvironments<T> {
  master: T;
  beta: T;
  production: T;
}

const {
  TRAVIS_BRANCH,
  TRAVIS_PULL_REQUEST,
  TRAVIS_COMMIT_MESSAGE,
  SITE_NAME,
  PACKAGE_LOCATION,
  DEPLOYMENT_USERNAME,
  DEPLOYMENT_PASSWORD,
} = process.env; // from travis

/* If running inside of a pull request then skip deploy.
   (Note, this is actually a triple safe-guard, as travis.yml already will not call deploy for pull requests.
   And in any case, pull requests don't get secret variables like username or password
   passed to them by the CI tools, so the deploy would abort at any rate).
 */
if (TRAVIS_PULL_REQUEST !== 'false') {
  exit('Skipping deploy for pull requests');
}

const deploymentSlotsDictionary: IDeployEnvironments<string> = {
  master: '-alpha',
  beta: '-beta',
  production: '-staging',
};

const deploymentSlot = deploymentSlotsDictionary[TRAVIS_BRANCH];

if (!deploymentSlot) {
  exit('Invalid branch name. Skipping deploy.');
}

const BUILD_DIRECTORY = path.join(PACKAGE_LOCATION, 'build');

if (!shell.test('-d', BUILD_DIRECTORY)) {
  exit('ERROR: No build directory found!');
}

shell.echo('Proceeding to main body of the deploy script');

const allFiles = listAllFilesRecursive(BUILD_DIRECTORY);
const [gitIgnoreFiles, allOtherFiles] = partition(allFiles, (filepath: string) =>
  filepath.toLowerCase().endsWith('.gitignore'),
);

if (gitIgnoreFiles.length > 0) {
  throw new Error(
    [
      'Unexpectedly found 1 or more .gitignore files. This should not happen: ',
      ...gitIgnoreFiles.map(filepath => ' - ' + filepath),
    ].join('\n'),
  );
}

writeDeploymentLog(BUILD_DIRECTORY, allOtherFiles);

deploy(`${PACKAGE_LOCATION}/build`, SITE_NAME, `${SITE_NAME}${deploymentSlot}`);

exit(`Deployment to ${SITE_NAME} completed!`);

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

// async function cloneExistingRepoIfRelevant(
//   source: { friendlyName: string; urlWithUsernameAndPassword: string },
//   folder: string,
// ) {
//   log('Copying existing assets from ' + source.friendlyName);

//   // For some reason, seems to need to be an ASYNCHRONOUS command, or else was
//   //    moving on with the logic before finishing!
//   await new Promise((resolve, reject) => {
//     const process = shell.exec(
//       'git clone ' + source.urlWithUsernameAndPassword + ' existing_build',
//       {
//         async: true,
//       },
//     );
//     process.on('error', error => reject(error));
//     process.on('message', message => console.log(message));
//     process.on('exit', (code: number, signal: string) => {
//       if (code === 0) {
//         resolve();
//       } else {
//         reject(new Error('Unexpected error: ' + signal));
//       }
//     });
//   });

//   shell.cp('-n', ['existing_build/*.js', 'existing_build/*.css'], '.');

//   let oldLibsPath = path.resolve(folder, 'existing_build/libs');

//   if (fs.existsSync(oldLibsPath)) {
//     let newLibsPath = path.resolve(folder, 'libs');

//     for (let asset of fs.readdirSync(oldLibsPath)) {
//       let libPath = path.resolve(newLibsPath, asset);
//       // Check if old assets don't name-conflict
//       if (fs.existsSync(libPath)) {
//         console.log(
//           `The library "${asset}" is already in current build, so skipping copying it from a previous build`,
//         );
//       } else {
//         console.log(
//           `Copying "${asset}" from a previous build into the current "libs" folder`,
//         );
//         fs.copySync(path.resolve(oldLibsPath, asset), libPath);
//       }
//     }

//     // Note: dividing by 1000 to go from JS dates to UNIX epoch dates
//     let now = new Date().getTime() / 1000;

//     let oldHistoryPath = path.resolve(folder, 'existing_build/history.json');
//     let newHistoryPath = path.resolve(folder, 'history.json');
//     let oldAssetsPath = path.resolve(folder, 'existing_build/bundles');
//     let newAssetsPath = path.resolve(folder, 'bundles');

//     let history = {};
//     if (fs.existsSync(newHistoryPath)) {
//       log(`The new history path ("${newHistoryPath}") already exists, re-using it`);
//       history = JSON.parse(fs.readFileSync(newHistoryPath).toString());
//     }

//     if (fs.existsSync(oldHistoryPath)) {
//       // Parse old history file if it exists
//       printHistoryDetailsIfAvailable('History of existing build:', oldHistoryPath);
//       log('\n\n');
//       let oldHistory = JSON.parse(fs.readFileSync(oldHistoryPath).toString());
//       for (let key in oldHistory) {
//         history[key] = oldHistory[key];
//       }
//     }

//     // Add new asset files to history, with current timestamp; exclude chunk files
//     let newAssets = fs.readdirSync(newAssetsPath);
//     for (let asset of newAssets) {
//       if (!/chunk.js/i.test(asset)) {
//         history[asset] = { time: now };
//       }
//     }

//     let existingAssets = fs.readdirSync(oldAssetsPath);
//     for (let asset of existingAssets) {
//       let assetPath = path.resolve(newAssetsPath, asset);
//       // Check if old assets don't name-conflict and are still young enough to keep
//       if (
//         history[asset] &&
//         !fs.existsSync(assetPath) &&
//         now - history[asset].time < 60 * 60 * 24 * DAYS_TO_KEEP_HISTORY
//       ) {
//         fs.writeFileSync(assetPath, fs.readFileSync(path.resolve(oldAssetsPath, asset)));
//       }
//     }

//     fs.writeFileSync(newHistoryPath, JSON.stringify(history));
//   }

//   // At the end, remove the existing_build directory:
//   shell.rm('-rf', 'existing_build');
// }

function deploy(path: string, site: string, siteWithStaging: string) {
  const commitMessageSanitized = TRAVIS_COMMIT_MESSAGE.replace(/\W/g, '_');

  shell.pushd(path);

  shell.exec('git init');

  shell.exec('git config --add user.name "Travis CI"');
  shell.exec('git config --add user.email "travis.ci@microsoft.com"');

  shell.exec('git add -A');
  shell.exec(`git commit -m "${commitMessageSanitized}"`);

  shell.exec(
    `git push https://${DEPLOYMENT_USERNAME}:${DEPLOYMENT_PASSWORD}@${siteWithStaging}.scm.azurewebsites.net:443/${site}.git -f -u HEAD:refs/heads/master`,
  );

  shell.popd();
}

function listAllFilesRecursive(initialDir: string): string[] {
  const prefixLength = initialDir.length;
  return getAllFilesHelper(initialDir).map(filename => filename.substr(prefixLength));

  function getAllFilesHelper(dir: string): string[] {
    return fs.readdirSync(dir).reduce((files: string[], file) => {
      const fullPath = path.join(dir, file);
      const isDirectory = fs.statSync(fullPath).isDirectory();
      return isDirectory
        ? [...files, ...getAllFilesHelper(fullPath)]
        : [...files, fullPath];
    }, []);
  }
}

function writeDeploymentLog(buildDirectory: string, files: string[]) {
  const deploymentLogFilename = new Date().toISOString().replace(/\:/g, '_') + '.txt';
  shell.echo('Deploying the following files from the build directory:');
  shell.echo(files.join('\n'));

  if (!fs.existsSync(path.join(buildDirectory, 'DeploymentLog'))) {
    fs.mkdirSync(path.join(buildDirectory, 'DeploymentLog'));
  }

  fs.writeFileSync(
    path.join(buildDirectory, 'DeploymentLog', deploymentLogFilename),
    files.join('\n'),
  );
}

function exit(reason: string, abort?: boolean) {
  if (reason) {
    abort ? console.error(reason) : console.log(reason);
  }

  return abort ? process.exit(1) : process.exit(0);
}
