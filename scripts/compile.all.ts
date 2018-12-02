import shell from 'shelljs';
const PACKAGES_TO_COMPILE = ['common', 'editor', 'runner', 'server'];

PACKAGES_TO_COMPILE.forEach(pkg => {
  shell.pushd(`packages/${pkg}`);
  shell.exec('tsc -p tsconfig.json');
  shell.popd();
});
