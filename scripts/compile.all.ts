import shell from 'shelljs';
const PACKAGES_TO_COMPILE = ['common', 'editor', 'runner', 'server'];

const args = {
  strict: true,
  noEmit: true,
  noImplicitAny: true,
  noImplicitReturns: true,
  noImplicitThis: true,
};

const stringArgs = Object.keys(args)
  .map(key => `--${key} ${args[key]}`)
  .join(' ');

PACKAGES_TO_COMPILE.forEach(pkg => {
  shell.pushd(`packages/${pkg}`);
  shell.exec(`tsc -p tsconfig.json ${stringArgs}`);
  shell.popd();
});
