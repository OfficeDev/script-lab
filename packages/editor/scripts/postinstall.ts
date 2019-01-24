import { PACKAGE_VERSIONS, hyphenate } from '../../common/src/package-versions';

const expectedPackages: {
  [key: string]: {
    name: string;
    version: string;
    copyAsName: string;
    pathToCopyFrom: string;
    pathToCopyTo: string;
  };
} = {
  monaco: {
    name: 'monaco-editor',
    version: PACKAGE_VERSIONS['monaco-editor'],
    copyAsName: 'monaco-editor',
    pathToCopyFrom: 'min/vs',
    pathToCopyTo: 'vs',
  },
  'monaco-old': {
    name: 'monaco-editor-old',
    version: PACKAGE_VERSIONS['monaco-editor-old'],
    copyAsName: 'monaco-editor',
    pathToCopyFrom: 'min/vs',
    pathToCopyTo: 'vs',
  },
  officeJs: {
    // Note: this package is now used only for offline development
    name: '@microsoft/office-js',
    version: PACKAGE_VERSIONS['@microsoft/office-js'],
    copyAsName: 'office-js',
    pathToCopyFrom: 'dist',
    pathToCopyTo: '',
  },
};

const additionalFilesToCopy = [
  {
    from: '../../node_modules/monaco-editor/monaco.d.ts',
    to: './src/interfaces/monaco.d.ts',
  },
];

// cspell:ignore precompile, precompiled
const oldFilesToRemove = [
  './precompile-sources',
  './public/vs',
  './public/external/vs',
  './public/precompiled',
];

////////////////////////////////////////

import path from 'path';
console.log('Running postinstall on ' + path.resolve('.'));

import fs from 'fs-extra';

oldFilesToRemove.forEach(filename => {
  console.log(`Removing "${filename}`);
  if (fs.existsSync(filename)) {
    fs.removeSync(filename);
  }
});

for (const key in expectedPackages) {
  const packageToCheck = expectedPackages[key];
  console.log(
    `Checking that "${packageToCheck.name}" matches expected version "${
      packageToCheck.version
    }"`,
  );

  if (
    fs.readJsonSync(`../../node_modules/${packageToCheck.name}/package.json`).version !==
    packageToCheck.version
  ) {
    throw new Error(
      `The ${packageToCheck.copyAsName} package does NOT match expected version. ` +
        'Please update the expected number above, ' +
        `then update the version numbers at "packages/common/src/package-versions.ts".`,
    );
  }
}

const foldersToCopy: Array<{ from: string; to: string }> = [];
for (const key in expectedPackages) {
  const packageToCheck = expectedPackages[key];

  foldersToCopy.push({
    from: `../../node_modules/${packageToCheck.name}/${packageToCheck.pathToCopyFrom}`,
    to: `./public/external/${packageToCheck.copyAsName}-${hyphenate(
      packageToCheck.version,
    )}${packageToCheck.pathToCopyTo ? '/' + packageToCheck.pathToCopyTo : ''}`,
  });
}

[...foldersToCopy, ...additionalFilesToCopy].forEach(pair => {
  console.log(`Copying to "${pair.to}"`);

  fs.removeSync(pair.to);
  fs.copySync(pair.from, pair.to);
});
