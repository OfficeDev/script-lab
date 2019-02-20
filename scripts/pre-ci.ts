import childProcess from 'child_process';

// For anything run by continuous integration, ensure that it doesn't have
// any code that we didn't want committed by accident.

// The keywords (written here with extra spaces, so that it itself doesn't provide a match)
// cspell:ignore stopstop
const keywordsToFailOn = ['FIXME', 'STOPSTOP'];

try {
  keywordsToFailOn.forEach(rawWord => {
    const match = rawWord.replace(/ /g, '');
    const command = `git grep --ignore-case ${match}`;
    console.log('Running command: `' + command + '`');

    let results = childProcess
      .execSync(command)
      .toString()
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Expecting to find some results (namely, in this file).
    // If it didn't find anything, that something is amiss.
    // Note: intentionally having it find something in at least one file (this file)
    //     or else "git grep" returns a non-zero exit code on 0 matches!
    if (results.length < 1) {
      throw new Error('Unexpected');
    }

    results = results.filter(line => !line.startsWith('scripts/pre-ci.ts:'));

    // After filtering out, expecting 0 matches
    if (results.length > 0) {
      console.error(
        'Found flagged words within the git directory files. Failing pre-ci check.',
      );
      console.error('Here were the matching entries:');
      console.warn(results.map(line => ' - ' + line).join('\n'));
      process.exit(1);
    }
  });

  console.log(`=== Done running pre-ci script ===`);
  process.exit(0);
} catch (e) {
  console.error('Unexpected error');
  console.error(e);
  process.exit(1);
}
