var shell = require('shelljs')

var { TRAVIS_COMMIT } = process.env // from travis

var commands = [
  `export REACT_APP_COMMIT='${TRAVIS_COMMIT}'`,
  `export REACT_APP_LAST_UPDATED='${new Date().toUTCString()}'`,
  'yarn react-scripts-ts:build',
].join(' && ')

shell.exec(commands)
