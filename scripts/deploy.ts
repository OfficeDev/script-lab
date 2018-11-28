// cSpell:ignore pushd, popd

import path from 'path';
import shell from 'shelljs';
import fs from 'fs-extra';
import { partition } from 'lodash';

var {
  TRAVIS_BRANCH,
  TRAVIS_COMMIT_MESSAGE,
  SITE_NAME,
  PACKAGE_LOCATION,
  DEPLOYMENT_USERNAME,
  DEPLOYMENT_PASSWORD,
} = process.env; // from travis

var TRAVIS_COMMIT_MESSAGE_SANITIZED = TRAVIS_COMMIT_MESSAGE.replace(/\W/g, '_');

var deploymentSlot = {
  master: '-alpha',
  beta: '-beta',
  production: '',
}[TRAVIS_BRANCH];

if (deploymentSlot !== undefined) {
  const BUILD_DIRECTORY = path.join(PACKAGE_LOCATION, 'build');

  if (shell.test('-d', BUILD_DIRECTORY)) {
    shell.echo('starting deployment');

    const allFiles = listAllFilesRecursive(BUILD_DIRECTORY);
    const [gitIgnoreFiles, allOtherFiles] = partition(allFiles, (filepath: string) =>
      filepath.toLowerCase().endsWith('.gitignore'),
    );

    if (gitIgnoreFiles.length > 0) {
      shell.echo(
        'Removing unnecessary gitIgnore files that ended up in the build directory',
      );
      gitIgnoreFiles.forEach(filepath => {
        fs.removeSync(filepath);
        shell.echo(' - ' + filepath);
      });
    }

    writeDeploymentLog(BUILD_DIRECTORY, allOtherFiles);

    deploy(`${PACKAGE_LOCATION}/build`, SITE_NAME, `${SITE_NAME}${deploymentSlot}`);
  } else {
    shell.echo('ERROR: No build directory found!');
    shell.exit(1);
  }

  // removing this for now, might bring back at a later date when we have
  // and official subscription

  // // Not all packages have a storybook, therefore only
  // // deploy storybook when one exists
  // if (shell.test('-d', `${PACKAGE_LOCATION}/build-storybook`)) {
  //   shell.echo('starting deployment of storybook');
  //   deploy(
  //     `${PACKAGE_LOCATION}/build-storybook`,
  //     `${SITE_NAME}-storybook`,
  //     `${SITE_NAME}-storybook${deploymentSlot}`,
  //   );
  // }
}

function deploy(path: string, site: string, siteWithStaging: string) {
  shell.pushd(path);

  shell.exec('git init');

  shell.exec('git config --add user.name "Travis CI"');
  shell.exec('git config --add user.email "travis.ci@microsoft.com"');

  shell.exec('git add -A');
  shell.exec(`git commit -m "${TRAVIS_COMMIT_MESSAGE_SANITIZED}"`);

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
