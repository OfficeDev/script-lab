import * as inquirer from 'inquirer';

export async function promptCustomText(
  message: string,
  options: { required: boolean },
): Promise<string> {
  let keepGoing = true;

  while (keepGoing) {
    let answer = ((
      await inquirer.prompt({
        name: 'question',
        message: message,
      })
    )['question'] as string).trim();

    if (answer.toLowerCase() === 'quit') {
      keepGoing = false;
      quit();
    }

    if (options.required && answer.length == 0) {
      // Just keep going...
    } else {
      return answer;
    }
  }
}

function quit() {
  console.log('You have chosen to quit.');
  process.exit(0);
}
