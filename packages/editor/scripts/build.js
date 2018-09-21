var shell = require('shelljs')

var { TRAVIS_BRANCH, TRAVIS_COMMIT } = process.env // from travis

var REACT_APP_STAGING = {
  master: 'alpha',
  beta: 'beta',
  production: 'production',
}[TRAVIS_BRANCH]

var commands = [
  `export REACT_APP_STAGING='${REACT_APP_STAGING}'`,
  `export REACT_APP_COMMIT='${TRAVIS_COMMIT}'`,
  `export REACT_APP_LAST_UPDATED='${new Date().toUTCString()}'`,
  'yarn react-scripts-ts:build',
].join(' && ')

if (REACT_APP_STAGING) {
  shell.exec(commands)
}
