import childProcess from 'child_process';

// For anything run by continuous integration, ensure that it doesn't have
// any code that we didn't want committed by accident.

// The keywords (written here with extra spaces, so that it itself doesn't provide a match)
const keywordsToFailOn = ['F I X M E', 'S T O P S T O P'];

keywordsToFailOn.forEach(rawWord => {
  const match = rawWord.replace(/ /g, '');
  const command = `git grep --ignore-case ${match}`;
  console.log('Running command: `' + command + '`');

  const result = childProcess
    .execSync(command)
    .toString()
    .trim();
  if (result.length > 0) {
    console.error(
      'Found flagged words within the git directory files. Failing pre-ci check.',
    );
    console.error('Here were the matching entries:');
    console.warn(result);
    process.exit(1);
  }
});

console.log(`=== Done running pre-ci script ===`);
process.exit(0);
