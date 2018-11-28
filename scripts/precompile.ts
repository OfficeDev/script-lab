const PRECOMPILE_SPEC: {
  editor: ISpecArray;
} = {
  editor: [
    {
      name: 'style.css',
      relativeFilePath: 'style.css',
      injectInto: ['index.html'],
      processor: readAsIsProcessor,
    },
    {
      name: 'scripts-loader.js',
      relativeFilePath: 'scripts-loader',
      injectInto: ['index.html'],
      processor: webpackProcessor,
    },
  ],
};

const BEGIN_PLACEHOLDER_REGEX = /^.*(<!-- Begin precompile placeholder: .* -->).*$/;

const WEBPACK_MODE = process.env.TRAVIS ? 'production' : 'development';

////////////////////////////////////////

import fs from 'fs-extra';
import path from 'path';
import md5 from 'md5';
import childProcess from 'child_process';

for (const packageName in PRECOMPILE_SPEC) {
  const packageFullDir = path.join('packages', packageName);
  const publicFolderFullDir = path.join(packageFullDir, 'public');
  const targetFolderFullDir = path.join(publicFolderFullDir, 'precompiled');

  const fileLines: { [key: string]: string[] } = {};
  const unfulfilledPlaceholders: { [key: string]: string[] } = {};

  console.log(
    `=== [${packageName}]: Emptying the target dir "${targetFolderFullDir}" ===`,
  );
  fs.emptyDirSync(targetFolderFullDir);

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
  const perPackageSpec = PRECOMPILE_SPEC[packageName] as ISpecArray;
  perPackageSpec.forEach(spec => {
    console.log(`Processing precompile source "${spec.name}"`);
    const afterProcessing = spec.processor(
      path.resolve(packageFullDir, 'precompile-sources', spec.relativeFilePath),
    );
    const hash = md5(afterProcessing);
    const dotExtension = path.extname(spec.name);
    const baseName = path.basename(spec.name, dotExtension);
    const filenameWithHash = `${baseName}-${hash}${dotExtension}`;
    const pathToWriteTo = targetFolderFullDir + '/' + filenameWithHash;
    fs.writeFileSync(pathToWriteTo, afterProcessing);

    if (spec.injectInto.length > 0) {
      const resultingUrl = `%PUBLIC_URL%/precompiled/${filenameWithHash}`;
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
      });
    }
  });

  console.log(`=== [${packageName}]: Writing back after injecting placeholders ===`);
  for (const filename in fileLines) {
    const fullPath = path.join(publicFolderFullDir, filename);
    console.log(`    - ${fullPath}`);
    fs.writeFileSync(fullPath, fileLines[filename].join('\n'));
    childProcess.execSync(
      `${path.normalize('node_modules/.bin/prettier --write')} ${fullPath}`,
      {
        stdio: [0, 1, 2],
      },
    );

    if (unfulfilledPlaceholders[filename].length > 0) {
      throw new Error(
        [
          `Unfulfilled placeholders remain in file "${filename}: "`,
          unfulfilledPlaceholders[filename].map(item => ` - ${item}`),
        ].join('\n'),
      );
    }
  }
}

console.log(`=== Done running precompile script ===`);

////////////////////////////////////////

// Helpers
function readAsIsProcessor(fullPath: string): string {
  return fs.readFileSync(fullPath).toString();
}

function webpackProcessor(folderPath: string): string {
  childProcess.execSync(
    `${path.normalize(
      '../../../../node_modules/.bin/webpack-cli',
    )} --mode ${WEBPACK_MODE}`,
    {
      cwd: folderPath,
      stdio: [0, 1, 2],
    },
  );
  return fs.readFileSync(path.join(folderPath, 'dist/webpack/bundle.js')).toString();
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

type ISpecArray = Array<{
  name: string;
  relativeFilePath: string;
  injectInto: string[];
  processor: (fullPath: string) => string;
}>;
