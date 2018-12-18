import { mergeNewAndExistingBuildAssets } from './helper';

import path from 'path';
import fs from 'fs-extra';

const TEMP_DIRECTORY = path.join(__dirname, '__test__');

describe('deployment tests', () => {
  it('basic merge', () => {
    emptyTempDir();
    createTestFile(['previous', 'old.txt'], 'old');
    createTestFile(['previous', 'nested_abandoned', 'also_old.txt'], 'also old');
    createTestFile(['previous', 'nested', 'nested.html'], 'old nested');
    createTestFile(['previous', 'index.html'], 'old index');

    createTestFile(['current', 'index.html'], 'new index');
    createTestFile(['current', 'nested', 'nested.html'], 'new nested');

    mergeNewAndExistingBuildAssets({
      BUILD_DIRECTORY: path.join(TEMP_DIRECTORY, 'current'),
      PREVIOUS_BUILD_DIRECTORIES: [path.join(TEMP_DIRECTORY, 'previous')],
      FINAL_OUTPUT_DIRECTORY: path.join(TEMP_DIRECTORY, 'final'),
      DEPLOYMENT_LOG_FILENAME: 'current.log.txt',
    });

    // FIXME:
    // expect(
    //   fs.readFileSync(path.join(TEMP_DIRECTORY, 'current', 'index.html')).toString(),
    // ).toEqual('new index');
  });
});

fs.removeSync(TEMP_DIRECTORY);

///////////////////////////////////////

function emptyTempDir() {
  if (fs.existsSync(TEMP_DIRECTORY)) {
    fs.unlinkSync(TEMP_DIRECTORY);
  }

  fs.mkdir(TEMP_DIRECTORY);
}

function createTestFile(relativePathComponents: string[], contents: string) {
  const filename = relativePathComponents.pop();
  let fullDirPathGradual = TEMP_DIRECTORY;
  relativePathComponents.forEach(part => {
    fullDirPathGradual = path.join(fullDirPathGradual, part);
    if (!fs.existsSync(fullDirPathGradual)) {
      fs.mkdirSync(fullDirPathGradual);
    }
  });

  fs.writeFileSync(path.join(fullDirPathGradual, filename), contents);
}
