// cspell:ignore precompile, precompiled
const oldFilesToRemove = ['./precompile-sources', './public/precompiled'];

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
