var shell = require('shelljs');

var { TRAVIS_COMMIT } = process.env; // from travis

var commands = [
  `export REACT_APP_COMMIT='${TRAVIS_COMMIT}'`,
  `export REACT_APP_LAST_UPDATED='${new Date().toUTCString()}'`,

  'export CI=false', // TODO: (nicobell) undo this... this is a hack to suppress the following warning:
  // Users/nicobell/Coding/ide/node_modules/source-map-support/source-map-support.js
  // Module not found: Can't resolve 'module' in ' / Users / nicobell / Coding / ide / node_modules / source - map - support'
  // I believe this is being caused by the introduction of typescript as a non-dev dependency for the fhl stuff
  // something about them using source-map-support is messing things up
  // By setting this env var, the warning will not make travis fail and stop deployment
  'yarn react-scripts:build',
].join(' && ');

shell.exec(commands);
