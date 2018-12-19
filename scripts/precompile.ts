const PRECOMPILE_SPEC_LIST: {
  editor: ISpecArray;
  runner: ISpecArray;
} = {
  editor: [],
  runner: [
    {
      name: 'custom-functions.js',
      relativeFilePath: 'custom-functions',
      injectInto: ['custom-functions.html'],
      processor: webpackProcessor,
    },
    {
      name: 'style.css',
      relativeFilePath: '../../editor/precompile-sources/style.css',
      injectInto: ['index.html'],
      processor: readAsIsProcessor,
    },
  ],
};

const BEGIN_PLACEHOLDER_REGEX = /^.*(<!-- Begin precompile placeholder: .* -->).*$/;

// Setting to production mode both makes the file smaller, and avoids merge conflicts
// by removing comments (comments that otherwise have source maps that include
// the absolutely file path to the repo).
// To temporarily see unminified files, switch to "development" (but do NOT check in like this!)
const WEBPACK_MODE = 'production';

////////////////////////////////////////

import fs from 'fs-extra';
import path from 'path';
import md5 from 'md5';
import childProcess from 'child_process';

const packagesRequested = process.argv.slice(2 /* actual args start on the 3rd one */);
const IS_INCREMENTAL_BUILD = packagesRequested.length > 0;

let specsToCompile: { [key: string]: ISpecArray };
if (IS_INCREMENTAL_BUILD) {
  console.warn('Only recompile requested packages: ' + JSON.stringify(packagesRequested));
  specsToCompile = {};
  packagesRequested.forEach(item => {
    let [packageName, fileName] = item.split('/');
    if (PRECOMPILE_SPEC_LIST[packageName]) {
      let theExactSpec = (PRECOMPILE_SPEC_LIST[packageName] as ISpecArray).find(
        spec => spec.name === fileName,
      );
      if (theExactSpec) {
        specsToCompile[packageName] = specsToCompile[packageName] || [];
        specsToCompile[packageName].push(theExactSpec);
      } else {
        throw new Error(`The requested package/file combo, "${item}", was not found.`);
      }
    } else {
      throw new Error(`The requested package/file combo, "${item}", was not found.`);
    }
  });
} else {
  specsToCompile = PRECOMPILE_SPEC_LIST;
}

for (const packageName in specsToCompile) {
  const packageFullDir = path.join('packages', packageName);
  const publicFolderFullDir = path.join(packageFullDir, 'public');
  const targetFolderFullDir = path.join(publicFolderFullDir, 'precompiled');

  const fileLines: { [key: string]: string[] } = {};
  const touchedFiles: { [key: string]: boolean } = {};
  const unfulfilledPlaceholders: { [key: string]: string[] } = {};

  if (!IS_INCREMENTAL_BUILD) {
    console.log(
      `=== [${packageName}]: Emptying the target dir "${targetFolderFullDir}" ===`,
    );
    fs.emptyDirSync(targetFolderFullDir);
  }

  console.log(`=== [${packageName}]: Analyzing files ===`);
  fs.readdirSync(publicFolderFullDir).forEach(filename => {
    if (filename.endsWith('.html')) {
      const fullPath = path.join(publicFolderFullDir, filename);
      console.log(`Analyzing "${fullPath}" for injectable placeholders`);
      const lines = fs
        .readFileSync(fullPath)
        .toString()
        .split('\n');

      const placeholders = lines
        .map(line => BEGIN_PLACEHOLDER_REGEX.exec(line.trim()))
        .filter(result => result)
        .map(result => result![1] /* get just the capture group, Group 1 */);

      if (placeholders.length === 0) {
        console.log('    No placeholders found.');
      } else {
        console.log(`    Found ${placeholders.length} placeholders: `);
        placeholders.forEach(item => console.log(`    - ${item}`));

        fileLines[filename] = lines;
        unfulfilledPlaceholders[filename] = placeholders;
      }
    }
  });

  console.log(`=== [${packageName}]: Processing files ===`);
  const perPackageSpec = specsToCompile[packageName] as ISpecArray;
  perPackageSpec.forEach(spec => {
    console.log(`Processing precompile source "${spec.name}"`);
    const afterProcessing = spec.processor(
      path.resolve(packageFullDir, 'precompile-sources', spec.relativeFilePath),
    );
    const hash = getPlatformAgnosticHash(afterProcessing);
    const dotExtension = path.extname(spec.name);
    const baseName = path.basename(spec.name, dotExtension);
    const filenameWithHash = `${baseName}-${hash}${dotExtension}`;
    const pathToWriteTo = targetFolderFullDir + '/' + filenameWithHash;
    fs.writeFileSync(pathToWriteTo, afterProcessing);

    if (spec.injectInto.length > 0) {
      const resultingUrl = `/precompiled/${filenameWithHash}`;
      const toInject = spec.name
        .trim()
        .toLowerCase()
        .endsWith('.css')
        ? `<link rel="stylesheet" href="${resultingUrl}" />`
        : `<script src="${resultingUrl}"></script>`;
      console.log(`Injecting \`${toInject}\``);
      spec.injectInto.forEach(fileToInjectInto => {
        console.log(`    into: "${fileToInjectInto}"`);
        substituteIntoIndexFileLines({
          unfulfilledPlaceholders,
          fileLines: fileLines,
          filenameToInjectInto: fileToInjectInto,
          injectableName: spec.name,
          textToSubstitute: toInject,
        });
        touchedFiles[fileToInjectInto] = true;
      });
    }
  });

  console.log(`=== [${packageName}]: Writing back after injecting placeholders ===`);
  for (const filename in fileLines) {
    const fullPath = path.join(publicFolderFullDir, filename);
    console.log(`    - ${fullPath}`);
    fs.writeFileSync(fullPath, fileLines[filename].join('\n'));

    if (touchedFiles[filename]) {
      execShellCommand('node_modules/.bin/prettier', ['--write', fullPath]);
    }

    let throwErrorDueToUnfulfilled = unfulfilledPlaceholders[filename].length > 0;
    if (IS_INCREMENTAL_BUILD) {
      throwErrorDueToUnfulfilled = false;
    }

    if (throwErrorDueToUnfulfilled) {
      throw new Error(
        [
          `Unfulfilled precompile placeholders remain in file "${filename}":`,
          unfulfilledPlaceholders[filename].map(item => ` - ${item}`),
          `Please open "scripts/precompile.ts" and check the configuration at the top of the file, `,
          `to ensure that your expected placeholder is being compiled and injected into the right files.`,
        ].join('\n'),
      );
    }
  }
}

console.log(`=== Done running precompile script ===`);

////////////////////////////////////////

// Helpers

function execShellCommand(
  commandPath: string,
  args: string[],
  otherOptions: { cwd?: string } = {},
): void {
  const fullCommand = [path.normalize(commandPath), ...args].join(' ');
  console.info(
    `Executing shell command: "${fullCommand}"` +
      (otherOptions.cwd ? ` in folder "${otherOptions.cwd}"` : ''),
  );

  childProcess.execSync(fullCommand, {
    stdio: [0, 1, 2],
    ...otherOptions,
  });
}

function readAsIsProcessor(fullPath: string): string {
  return fs.readFileSync(fullPath, 'utf8').toString();
}

function webpackProcessor(folderPath: string): string {
  execShellCommand(
    '../../../../node_modules/.bin/webpack-cli',
    ['--mode', WEBPACK_MODE],
    { cwd: folderPath },
  );
  return fs
    .readFileSync(path.join(folderPath, 'dist/webpack/bundle.js'), 'utf8')
    .toString();
}

function substituteIntoIndexFileLines({
  unfulfilledPlaceholders,
  fileLines,
  filenameToInjectInto,
  injectableName,
  textToSubstitute,
}: {
  unfulfilledPlaceholders: { [key: string]: string[] };
  fileLines: { [key: string]: string[] };
  filenameToInjectInto: string;
  injectableName: string;
  textToSubstitute: string;
}) {
  const lines: string[] = fileLines[filenameToInjectInto];
  if (!lines) {
    throw new Error(
      `Cannot find file "${filenameToInjectInto}", it must not have had any placeholders! ` +
        `Please check the FILES_SPEC defined at the top of this script.`,
    );
  }
  const beginTextToFind = getPlaceholderTextToFind('Begin', injectableName);
  const beginLineIndex = indexOfOneAndOnly(lines, beginTextToFind);
  const endLineIndex = indexOfOneAndOnly(
    lines,
    getPlaceholderTextToFind('End', injectableName),
  );

  const indexOfEntryInUnfulfilledPlaceholderList = unfulfilledPlaceholders[
    filenameToInjectInto
  ].indexOf(beginTextToFind);
  if (indexOfEntryInUnfulfilledPlaceholderList < 0) {
    throw new Error(
      `Unexpected error, "${beginTextToFind}" should have been in the unfulfilled placeholder list for file "${filenameToInjectInto}"`,
    );
  }
  unfulfilledPlaceholders[filenameToInjectInto].splice(
    indexOfEntryInUnfulfilledPlaceholderList,
    1,
  );

  fileLines[filenameToInjectInto] = [
    ...lines.slice(0, beginLineIndex + 1),
    textToSubstitute,
    ...lines.slice(endLineIndex),
  ];
}

function indexOfOneAndOnly(lines: string[], fullTextToFind: string): number {
  const predicate: (line: string) => boolean = line => line.trim() === fullTextToFind;
  const indexOfFirst = lines.findIndex(predicate);
  if (indexOfFirst < 0) {
    throw new Error(`Could not find the expected line: ${fullTextToFind}`);
  }
  const remainingLines = lines.slice(indexOfFirst + 1);
  const nextMatch = remainingLines.findIndex(predicate);
  if (nextMatch >= 0) {
    throw new Error(`Should not have found a duplicate of the line: ${fullTextToFind}`);
  }
  return indexOfFirst;
}

function getPlaceholderTextToFind(prefix: 'Begin' | 'End', filename: string): string {
  return `<!-- ${prefix} precompile placeholder: ${filename} -->`;
}

function getPlatformAgnosticHash(text: string) {
  return md5(
    text
      .split('\n')
      .map(line => line.trim())
      .join('\n'),
  );
}

type ISpecArray = Array<{
  name: string;
  relativeFilePath: string;
  injectInto: string[];
  processor: (fullPath: string) => string;
}>;
