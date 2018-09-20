var shell = require('shelljs')

var { TRAVIS_BRANCH } = process.env // from travis

var REACT_APP_STAGING = {
  deployment: 'alpha',
  beta: 'beta',
  production: 'production',
}[TRAVIS_BRANCH]

shell.exec(
  `export REACT_APP_STAGING=${REACT_APP_STAGING} && echo $REACT_APP_STAGING && react-scripts-ts build`,
)
