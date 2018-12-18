import path from 'path';
import shell from 'shelljs';
import fs from 'fs-extra';

export function mergeNewAndExistingBuildAssets({
  BUILD_DIRECTORY,
  PREVIOUS_BUILD_DIRECTORIES,
  FINAL_OUTPUT_DIRECTORY,
}: {
  BUILD_DIRECTORY: string;
  PREVIOUS_BUILD_DIRECTORIES: string[];
  FINAL_OUTPUT_DIRECTORY: string;
}): void {
  const allFiles = listAllFilesRecursive(BUILD_DIRECTORY);
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

  writeAssetLog(BUILD_DIRECTORY, allFiles);

  [...PREVIOUS_BUILD_DIRECTORIES, BUILD_DIRECTORY].forEach(sourceDir => {
    mergeDir(sourceDir, FINAL_OUTPUT_DIRECTORY);
  });
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

function writeAssetLog(buildDirectory: string, files: string[]) {
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

function mergeDir(src: string, dest: string) {
  const contents = fs.readdirSync(src);
  contents.forEach(name => {
    const fullSrcPath = path.join(src, name);
    const fullDestPath = path.join(dest, name);

    const stats = fs.lstatSync(fullSrcPath);
    if (stats.isDirectory()) {
      if (!fs.existsSync(fullDestPath)) {
        fs.mkdirSync(fullDestPath);
      }
    } else if (stats.isFile()) {
      // Note: will overwrite existing file if any, which is what we want
      fs.copyFileSync(fullSrcPath, fullDestPath);
    } else {
      throw new Error(`Unexpected file/folder type at "${fullSrcPath}"`);
    }
  });
}
