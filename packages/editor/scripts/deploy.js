var shell = require('shelljs')

var {
  TRAVIS,
  TRAVIS_BRANCH,
  TRAVIS_PULL_REQUEST,
  TRAVIS_COMMIT_MESSAGE,
  DEPLOYMENT_USERNAME,
  DEPLOYMENT_PASSWORD,
} = process.env // from travis

var TRAVIS_COMMIT_MESSAGE_SANITIZED = TRAVIS_COMMIT_MESSAGE.replace(/\W/g, '_')

var deploymentSlot = {
  deployment: '-alpha', // test
  beta: '-beta',
  production: '',
}[TRAVIS_BRANCH]

var SITE = `script-lab-react${deploymentSlot}`

if (deploymentSlot !== undefined) {
  shell.cd('build')
  shell.exec('git init')

  shell.exec('git config --add user.name "Travis CI"')
  shell.exec('git config --add user.email "travis.ci@microsoft.com"')

  shell.exec('git add -A')
  shell.exec(`git commit -m "${TRAVIS_COMMIT_MESSAGE_SANITIZED}"`)

  var result = shell.exec(
    `git push https://${DEPLOYMENT_USERNAME}:${DEPLOYMENT_PASSWORD}@${SITE}.scm.azurewebsites.net:443/${SITE}.git -q -f -u HEAD:refs/heads/master`,
    { silent: true },
  )
}
