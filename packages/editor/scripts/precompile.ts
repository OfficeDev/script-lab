const filesList: Array<{
  name: string;
  injectIntoHtml: boolean;
  processor: (fullPath: string) => string;
}> = [
  {
    name: 'style.css',
    injectIntoHtml: true,
    processor: readAsIsProcessor,
  },
];

/////////////////////////////////////////

import fs from 'fs-extra';
import path from 'path';
import md5 from 'md5';

const TARGET_DIR = 'public/precompiled';
const INDEX_FILE_FULL_PATH = 'public/index.html';

fs.emptyDirSync(TARGET_DIR);

let indexFileLines = fs
  .readFileSync(INDEX_FILE_FULL_PATH)
  .toString()
  .split('\n');

filesList.forEach(spec => {
  const fullPath = `precompile-sources/${spec.name}`;
  const afterProcessing = spec.processor(fullPath);
  const hash = md5(afterProcessing);
  const dotExtension = path.extname(fullPath);
  const baseName = path.basename(fullPath, dotExtension);
  const filenameWithHash = `${baseName}-${hash}${dotExtension}`;
  const pathToWriteTo = TARGET_DIR + '/' + filenameWithHash;
  fs.writeFileSync(pathToWriteTo, afterProcessing);

  if (spec.injectIntoHtml) {
    substituteIntoIndexFileLines(
      spec.name,
      `<link rel="stylesheet" href="%PUBLIC_URL%/precompiled/${filenameWithHash}" />`,
    );
  }
});

// After all the substitutions, write back:
fs.writeFileSync(INDEX_FILE_FULL_PATH, indexFileLines.join('\n'));

// Helpers
function readAsIsProcessor(fullPath: string) {
  return fs.readFileSync(fullPath).toString();
}

function substituteIntoIndexFileLines(filename: string, textToSubstitute: string) {
  const beginLineIndex = indexOfOneAndOnly('Begin', filename);
  const endLineIndex = indexOfOneAndOnly('End', filename);
  indexFileLines = [
    ...indexFileLines.slice(0, beginLineIndex + 1),
    textToSubstitute,
    ...indexFileLines.slice(endLineIndex),
  ];
}
function indexOfOneAndOnly(prefix: 'Begin' | 'End', filename: string): number {
  const fullTextToFind = `<!-- ${prefix} precompile placeholder: ${filename} -->`;
  const predicate: (line: string) => boolean = line => line.trim() === fullTextToFind;
  const indexOfFirst = indexFileLines.findIndex(predicate);
  if (indexOfFirst < 0) {
    throw new Error(`Could not find the expected line: ${fullTextToFind}`);
  }
  const remainingLines = indexFileLines.slice(indexOfFirst + 1);
  const nextMatch = remainingLines.findIndex(predicate);
  if (nextMatch >= 0) {
    throw new Error(`Should not have found a duplicate of the line: ${fullTextToFind}`);
  }
  return indexOfFirst;
}
