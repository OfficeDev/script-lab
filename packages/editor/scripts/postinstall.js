const fs = require('fs-extra');

// Remove old files:
const filesToRemove = ['./public/vs', './public/external/vs'];
filesToRemove.forEach(filename => {
  if (fs.existsSync(filename)) {
    fs.removeSync(filename);
  }
});

const monacoVersionExpected = '0.14.3';

if (
  fs.readJsonSync('../../node_modules/monaco-editor/package.json').version !==
  monacoVersionExpected
) {
  throw new Error(
    'Monaco editor does NOT match expected version. ' +
      'Please update the expected number above, ' +
      "then search for 'external/monaco-editor' within the codebase and ensure that the versions match.",
  );
}

const filesToCopy = [
  {
    from: '../../node_modules/monaco-editor/min/vs',
    to: `./public/external/monaco-editor-${getVersionNumberHyphenated(
      monacoVersionExpected,
    )}/vs`,
  },
  {
    from: '../../node_modules/monaco-editor/monaco.d.ts',
    to: './src/interfaces/monaco.d.ts',
  },
];
filesToCopy.forEach(pair => {
  fs.removeSync(pair.to);
  fs.copySync(pair.from, pair.to);
});

// Helper
function getVersionNumberHyphenated(versionString) {
  return versionString.replace(/\./g, '-');
}
