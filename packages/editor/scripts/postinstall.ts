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
    version: '0.14.3',
    copyAsName: 'monaco-editor',
    pathToCopyFrom: 'min/vs',
    pathToCopyTo: 'vs',
  },
  officeJs: {
    name: '@microsoft/office-js',
    version: '1.1.11-adhoc.20',
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

const oldFilesToRemove = ['./public/vs', './public/external/vs'];

////////////////////////////////////////

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
    `Checking that "${packageToCheck.name} matches expected version "${
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
        `then search for "external/${packageToCheck.copyAsName}" ` +
        `within the codebase and ensure that the versions match.`,
    );
  }
}

const foldersToCopy: Array<{ from: string; to: string }> = [];
for (const key in expectedPackages) {
  const packageToCheck = expectedPackages[key];

  foldersToCopy.push({
    from: `../../node_modules/${packageToCheck.name}/${packageToCheck.pathToCopyFrom}`,
    to: `./public/external/${packageToCheck.copyAsName}-${getVersionNumberHyphenated(
      expectedPackages.monaco.version,
    )}${packageToCheck.pathToCopyTo ? '/' + packageToCheck.pathToCopyTo : ''}`,
  });
}

[...foldersToCopy, ...additionalFilesToCopy].forEach(pair => {
  console.log(`Copying to "${pair.to}"`);

  fs.removeSync(pair.to);
  fs.copySync(pair.from, pair.to);
});

// Helper
function getVersionNumberHyphenated(versionString: string) {
  return versionString.replace(/\./g, '-');
}
