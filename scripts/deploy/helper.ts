import path from 'path';
import shell from 'shelljs';
import fs from 'fs-extra';

import { stripSpaces } from 'common/lib/utilities/string';

export function mergeNewAndExistingBuildAssets({
  BUILD_DIRECTORY,
  PREVIOUS_BUILD_DIRECTORIES,
  FINAL_OUTPUT_DIRECTORY,
  DEPLOYMENT_LOG_FILENAME,
}: {
  BUILD_DIRECTORY: string;
  PREVIOUS_BUILD_DIRECTORIES: string[];
  FINAL_OUTPUT_DIRECTORY: string;
  DEPLOYMENT_LOG_FILENAME: string;
}): void {
  console.log(
    stripSpaces(`
    Merging new and existing build assets, using:
    - Current build: ${BUILD_DIRECTORY}
    - Previous build directories: ${JSON.stringify(PREVIOUS_BUILD_DIRECTORIES)}
    - Final output destination: ${FINAL_OUTPUT_DIRECTORY}
    `),
  );

  const allFiles = getAllFilesRecursive(BUILD_DIRECTORY);
  const gitIgnoreFiles = allFiles.filter((filepath: string) =>
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

  writeAssetLog(BUILD_DIRECTORY, allFiles, DEPLOYMENT_LOG_FILENAME);

  if (!fs.existsSync(FINAL_OUTPUT_DIRECTORY)) {
    fs.mkdirSync(FINAL_OUTPUT_DIRECTORY);
  }

  [...PREVIOUS_BUILD_DIRECTORIES, BUILD_DIRECTORY].forEach(sourceDir => {
    mergeDir(sourceDir, FINAL_OUTPUT_DIRECTORY);
  });
}

export function getAllFilesRecursive(initialDir: string): string[] {
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

function writeAssetLog(
  buildDirectory: string,
  files: string[],
  deploymentLogFilename: string,
) {
  console.log('The following assets were created as part of this build:');
  files.forEach(item => console.log(' - ' + item));

  if (!fs.existsSync(path.join(buildDirectory, 'DeploymentLog'))) {
    fs.mkdirSync(path.join(buildDirectory, 'DeploymentLog'));
  }

  fs.writeFileSync(
    path.join(buildDirectory, 'DeploymentLog', deploymentLogFilename),
    files.map(filepath => filepath.replace(/\\/g, '/')).join('\n'),
  );
}

function mergeDir(src: string, dest: string) {
  const contents = fs.readdirSync(src);
  contents
    .filter(name => name !== '.git')
    .forEach(name => {
      const fullSrcPath = path.join(src, name);
      const fullDestPath = path.join(dest, name);

      const stats = fs.lstatSync(fullSrcPath);
      if (stats.isDirectory()) {
        if (fs.readdirSync(fullSrcPath).length > 0) {
          if (!fs.existsSync(fullDestPath)) {
            fs.mkdirSync(fullDestPath);
          }

          mergeDir(fullSrcPath, fullDestPath);
        }
      } else if (stats.isFile()) {
        // Note: will overwrite existing file if any, which is what we want
        fs.copyFileSync(fullSrcPath, fullDestPath);
      } else {
        throw new Error(`Unexpected file/folder type at "${fullSrcPath}"`);
      }
    });
}
