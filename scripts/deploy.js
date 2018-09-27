var shell = require("shelljs");

var {
  TRAVIS_BRANCH,
  TRAVIS_COMMIT_MESSAGE,
  SITE_NAME,
  PACKAGE_LOCATION,
  DEPLOYMENT_USERNAME,
  DEPLOYMENT_PASSWORD
} = process.env; // from travis

var TRAVIS_COMMIT_MESSAGE_SANITIZED = TRAVIS_COMMIT_MESSAGE.replace(/\W/g, "_");

var deploymentSlot = {
  master: "-alpha",
  beta: "-beta",
  production: ""
}[TRAVIS_BRANCH];

if (deploymentSlot !== undefined) {
  if (shell.test("-d", `${PACKAGE_LOCATION}/build`)) {
    shell.echo("starting deployment");
    deploy(
      `${PACKAGE_LOCATION}/build`,
      SITE_NAME,
      `${SITE_NAME}${deploymentSlot}`
    );
  } else {
    shell.echo("ERROR: No build directory found!");
    shell.exit(1);
  }

  // Not all packages have a storybook, therefore only
  // deploy storybook when one exists
  if (shell.test("-d", `${PACKAGE_LOCATION}/build-storybook`)) {
    shell.echo("starting deployment of storybook");
    deploy(
      `${PACKAGE_LOCATION}/build-storybook`,
      `${SITE_NAME}-storybook`,
      `${SITE_NAME}-storybook${deploymentSlot}`
    );
  }
}

function deploy(path, site, siteWithStaging) {
  shell.pushd(path);

  shell.exec("git init");

  shell.exec('git config --add user.name "Travis CI"');
  shell.exec('git config --add user.email "travis.ci@microsoft.com"');

  shell.exec("git add -A");
  shell.exec(`git commit -m "${TRAVIS_COMMIT_MESSAGE_SANITIZED}"`);

  var result = shell.exec(
    `git push https://${DEPLOYMENT_USERNAME}:${DEPLOYMENT_PASSWORD}@${siteWithStaging}.scm.azurewebsites.net:443/${site}.git -f -u HEAD:refs/heads/master`
  );

  shell.popd();
}
