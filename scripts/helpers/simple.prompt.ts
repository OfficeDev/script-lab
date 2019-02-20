import * as inquirer from 'inquirer';
import { cloneDeep, isString, isUndefined } from 'lodash';

const NO_CHOICE_SELECTED = '---';

export async function promptFromList<T>(options: {
  message: string;
  choices: Array<string | { value: string; name: string; keepIf?: boolean }>;
  mappings: { [key: string]: T };
  onQuit?: () => any;
}): Promise<T>;
export async function promptFromList<T extends string>(options: {
  message: string;
  choices: Array<string | { value: T; name: string; keepIf?: boolean }>;
  onQuit?: () => any;
}): Promise<T>;
export async function promptFromList(options: {
  message: string;
  choices: Array<string | { value: string; name: string; keepIf?: boolean }>;
  onQuit?: () => any;
  mappings?: { [key: string]: any };
}): Promise<any> {
  let appendedChoices: Array<typeof options.choices[0] | typeof NO_CHOICE_SELECTED> = [
    NO_CHOICE_SELECTED,
  ].concat(cloneDeep(options.choices) as any);

  const realChoices: { value: string; name: string }[] = appendedChoices
    .map(item => {
      if (isString(item)) {
        return { value: item, name: item };
      } else {
        if (isUndefined(item.keepIf)) {
          return item;
        } else {
          return item.keepIf ? item : null;
        }
      }
    })
    .filter(item => item != null)
    .map((item, index) => {
      const { value, name } = item!;
      return { value, name, key: index + 1 };
    });

  let answer = (await inquirer.prompt({
    type: 'list',
    name: 'question',
    message: options.message,
    choices: realChoices,
  }))['question'] as string;

  if (answer === NO_CHOICE_SELECTED) {
    console.log('You needed to choose one of the options. Please try again.');
    return promptFromList(options as any);
  } else if (answer.toLowerCase() === 'quit') {
    if (options.onQuit) {
      await options.onQuit();
    }
    quit();
  } else {
    if (options.mappings) {
      const remappedAnswer = options.mappings[answer.toLowerCase()];
      if (isUndefined(remappedAnswer)) {
        throw new Error(
          `No re-mapping specified for answer "${answer}" to question "${
            options.message
          }".`,
        );
      }
      return remappedAnswer;
    }

    return answer as any;
  }
}

export async function promptCustomText(
  message: string,
  options: { required: boolean },
): Promise<string> {
  let keepGoing = true;

  while (keepGoing) {
    let answer = ((await inquirer.prompt({
      name: 'question',
      message: message,
    }))['question'] as string).trim();

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

export async function promptToPressEnterToContinueOrQuitToExit(): Promise<void> {
  await promptCustomText(`Press <enter> to continue, or type "quit" to exit: `, {
    required: false,
  });
}

function quit() {
  console.log('You have chosen to quit.');
  process.exit(0);
}
