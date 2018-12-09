import { mergeNewAndExistingBuildAssets } from './helper';

import path from 'path';
import fs from 'fs-extra';

const TEMP_DIRECTORY = path.join(__dirname, '__temp__');

beforeEach(() => emptyTempDir());
afterEach(() => fs.removeSync(TEMP_DIRECTORY));

describe('deployment tests', () => {
  it('basic merge', () => {
    createTestFile(['previous', 'old.txt'], 'old');
    createTestFile(['previous', 'nested_abandoned', 'also_old.txt'], 'also old');
    createTestFile(['previous', 'nested', 'nested.html'], 'old nested');
    createTestFile(['previous', 'index.html'], 'old index');
    createTestFile(
      ['previous', 'DeploymentLog', 'previous.log.txt'],
      [
        `/index.html`,
        `/nested/nested.html`,
        `/nested_abandoned/also_old.txt`,
        `/old.txt`,
      ].join('\n'),
    );

    createTestFile(['current', 'index.html'], 'new index');
    createTestFile(['current', 'nested', 'nested.html'], 'new nested');

    mergeNewAndExistingBuildAssets({
      BUILD_DIRECTORY: path.join(TEMP_DIRECTORY, 'current'),
      PREVIOUS_BUILD_DIRECTORIES: [path.join(TEMP_DIRECTORY, 'previous')],
      FINAL_OUTPUT_DIRECTORY: path.join(TEMP_DIRECTORY, 'final'),
      DEPLOYMENT_LOG_FILENAME: 'current.log.txt',
    });

    checkFinal(['index.html'], 'new index');
    checkFinal(['nested', 'nested.html'], 'new nested');
    checkFinal(['old.txt'], 'old');
    checkFinal(['nested_abandoned', 'also_old.txt'], 'also old');
    checkFinal(
      ['DeploymentLog', 'previous.log.txt'],
      [
        '/index.html',
        '/nested/nested.html',
        '/nested_abandoned/also_old.txt',
        '/old.txt',
      ].join('\n'),
    );
    checkFinal(
      ['DeploymentLog', 'current.log.txt'],
      ['/index.html', '/nested/nested.html'].join('\n'),
    );
  });

  it('order matters', () => {
    createTestFile(['previous', 'old.txt'], 'old');
    createTestFile(['previous', 'nested_abandoned', 'also_old.txt'], 'also old');
    createTestFile(['previous', 'nested', 'nested.html'], 'old nested');
    createTestFile(['previous', 'index.html'], 'old index');

    createTestFile(['current', 'index.html'], 'new index');
    createTestFile(['current', 'nested', 'nested.html'], 'new nested');

    // Note the reversal of the "previous" and "current" for this test, to check that ordering matters
    mergeNewAndExistingBuildAssets({
      BUILD_DIRECTORY: path.join(TEMP_DIRECTORY, 'previous'),
      PREVIOUS_BUILD_DIRECTORIES: [path.join(TEMP_DIRECTORY, 'current')],
      FINAL_OUTPUT_DIRECTORY: path.join(TEMP_DIRECTORY, 'final'),
      DEPLOYMENT_LOG_FILENAME: 'previous.log.txt',
    });

    checkFinal(['index.html'], 'old index');
    checkFinal(['nested', 'nested.html'], 'old nested');
    checkFinal(['old.txt'], 'old');
    checkFinal(['nested_abandoned', 'also_old.txt'], 'also old');
    checkFinal(
      ['DeploymentLog', 'previous.log.txt'],
      [
        '/index.html',
        '/nested/nested.html',
        '/nested_abandoned/also_old.txt',
        '/old.txt',
      ].join('\n'),
    );
  });

  it('empty folders are skipped', () => {
    createTestFile(['previous', 'old.txt'], 'old');
    const fileToDelete = createTestFile(
      ['previous', 'empty_folder', 'file_to_delete.txt'],
      'data',
    );
    fs.removeSync(fileToDelete);

    createTestFile(['current', 'index.html'], 'new index');
    createTestFile(['current', 'nested', 'nested.html'], 'new nested');

    mergeNewAndExistingBuildAssets({
      BUILD_DIRECTORY: path.join(TEMP_DIRECTORY, 'current'),
      PREVIOUS_BUILD_DIRECTORIES: [path.join(TEMP_DIRECTORY, 'previous')],
      FINAL_OUTPUT_DIRECTORY: path.join(TEMP_DIRECTORY, 'final'),
      DEPLOYMENT_LOG_FILENAME: 'current.log.txt',
    });

    checkFinal(['index.html'], 'new index');
    checkFinal(['nested', 'nested.html'], 'new nested');
    checkFinal(['old.txt'], 'old');

    expect(fs.existsSync(path.join(TEMP_DIRECTORY, 'final', 'nested'))).toBeTruthy();
    expect(fs.existsSync(path.join(TEMP_DIRECTORY, 'final', 'empty_folder'))).toBeFalsy();
  });
});

///////////////////////////////////////

function emptyTempDir() {
  if (fs.existsSync(TEMP_DIRECTORY)) {
    fs.removeSync(TEMP_DIRECTORY);
  }

  fs.mkdir(TEMP_DIRECTORY);
}

/** Creates a file with the requested contents, and returns the final full path */
function createTestFile(relativePathComponents: string[], contents: string): string {
  const filename = relativePathComponents.pop();
  let fullDirPathGradual = TEMP_DIRECTORY;
  relativePathComponents.forEach(part => {
    fullDirPathGradual = path.join(fullDirPathGradual, part);
    if (!fs.existsSync(fullDirPathGradual)) {
      fs.mkdirSync(fullDirPathGradual);
    }
  });

  const fullPath = path.join(fullDirPathGradual, filename);
  fs.writeFileSync(fullPath, contents);
  return fullPath;
}

function checkFinal(relativePathComponents: string[], contents: string) {
  expect(
    fs
      .readFileSync(path.join(TEMP_DIRECTORY, 'final', ...relativePathComponents))
      .toString()
      .split('\n')
      .map(line => line.trim())
      .join('\n'),
  ).toEqual(contents);
}
