var shell = require('shelljs')

var { DEPLOYMENT_USERNAME, DEPLOYMENT_PASSWORD } = process.env // from travis

var SITE = 'script-lab-react'

shell.cd('build')
shell.exec('git init')

shell.exec('git config --add user.name "Travis CI"')
shell.exec('git config --add user.email "travis.ci@microsoft.com"')

shell.exec('git add -A')
shell.exec('git commit -m "commit message"')

var result = shell.exec(
  `git push https://${DEPLOYMENT_USERNAME}:${DEPLOYMENT_PASSWORD}@${SITE}.scm.azurewebsites.net:443/${SITE}.git  -q -f -u HEAD:refs/heads/master`,
  { silent: true },
)
