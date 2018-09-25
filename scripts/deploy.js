var shell = require('shelljs');

var {
  TRAVIS_BRANCH,
  TRAVIS_COMMIT_MESSAGE,
  SITE_NAME,
  PACKAGE_LOCATION,
  DEPLOYMENT_USERNAME,
  DEPLOYMENT_PASSWORD,
} = process.env; // from travis

var TRAVIS_COMMIT_MESSAGE_SANITIZED = TRAVIS_COMMIT_MESSAGE.replace(/\W/g, '_');

var deploymentSlot = {
  deployment: '-alpha', // TODO: change deployment to master
  beta: '-beta',
  production: '',
}[TRAVIS_BRANCH];

var SITE = `${SITE_NAME}${deploymentSlot}`;

if (deploymentSlot !== undefined) {
  shell.exec('echo "starting deployment"');
  shell.cd(`${PACKAGE_LOCATION}/build`);

  shell.exec('git init');

  shell.exec('git config --add user.name "Travis CI"');
  shell.exec('git config --add user.email "travis.ci@microsoft.com"');

  shell.exec('git add -A');
  shell.exec(`git commit -m "${TRAVIS_COMMIT_MESSAGE_SANITIZED}"`);

  var result = shell.exec(
    `git push https://${DEPLOYMENT_USERNAME}:${DEPLOYMENT_PASSWORD}@${SITE}.scm.azurewebsites.net:443/${SITE_NAME}.git -q -f -u HEAD:refs/heads/master`,
  );
}
