import { ScriptLabError } from '../error';
import isPrimitive from 'is-primitive';

const UNABLE_TO_DISPLAY_OBJECT_DEFAULT_MESSAGE = '<Unable to display object>';

export function matchesSearch(
  queryLowercase: string,
  texts: Array<string | null>,
): boolean {
  if (queryLowercase.length === 0) {
    return true;
  }

  for (const item of texts) {
    if (item) {
      if (item.toLowerCase().includes(queryLowercase)) {
        return true;
      }
    }
  }

  return false;
}

// tslint:disable
export function stripSpaces(text: string) {
  let lines: string[] = text.split('\n');

  // Replace each tab with 4 spaces.
  for (let i: number = 0; i < lines.length; i++) {
    lines[i].replace('\t', '    ');
  }

  let isZeroLengthLine: boolean = true;
  let arrayPosition: number = 0;

  // Remove zero length lines from the beginning of the snippet.
  do {
    let currentLine: string = lines[arrayPosition];
    if (currentLine.trim() === '') {
      lines.splice(arrayPosition, 1);
    } else {
      isZeroLengthLine = false;
    }
  } while (isZeroLengthLine || arrayPosition === lines.length);

  arrayPosition = lines.length - 1;
  isZeroLengthLine = true;

  // Remove zero length lines from the end of the snippet.
  do {
    let currentLine: string = lines[arrayPosition];
    if (currentLine.trim() === '') {
      lines.splice(arrayPosition, 1);
      arrayPosition--;
    } else {
      isZeroLengthLine = false;
    }
  } while (isZeroLengthLine);

  // Get smallest indent for align left.
  let shortestIndentSize: number = 1024;
  for (let line of lines) {
    let currentLine: string = line;
    if (currentLine.trim() !== '') {
      let spaces: number = line.search(/\S/);
      if (spaces < shortestIndentSize) {
        shortestIndentSize = spaces;
      }
    }
  }

  // Align left
  for (let i: number = 0; i < lines.length; i++) {
    if (lines[i].length >= shortestIndentSize) {
      lines[i] = lines[i].substring(shortestIndentSize);
    }
  }

  // Convert the array back into a string and return it.
  let finalSetOfLines: string = '';
  for (let i: number = 0; i < lines.length; i++) {
    if (i < lines.length - 1) {
      finalSetOfLines += lines[i] + '\n';
    } else {
      finalSetOfLines += lines[i];
    }
  }
  return finalSetOfLines;
}

export function stringifyPlusPlus(
  object: any,
  options: { quoteStrings?: boolean; skipErrorStack?: boolean } = {},
): string {
  const defaultOptions: typeof options = {
    quoteStrings: false,
    skipErrorStack: false,
  };

  options = { ...defaultOptions, ...options };

  if (object === null) {
    return 'null';
  }

  if (typeof object === 'undefined') {
    return 'undefined';
  }

  // Don't JSON.stringify strings, because might not want quotes in the output
  if (typeof object === 'string') {
    return options.quoteStrings ? `"${object}"` : object;
  }

  if (Array.isArray(object)) {
    if (isEachObjectAPrimitiveType(object)) {
      return (
        '[' +
        object
          .map(item => stringifyPlusPlus(item, { ...options, quoteStrings: true }))
          .join(', ') +
        ']'
      );
    } else {
      return (
        '[' +
        '\n' +
        indentAll(
          object
            .map(item => stringifyPlusPlus(item, { ...options, quoteStrings: true }))
            .join(',' + '\n'),
        ) +
        '\n' +
        ']'
      );
    }
  }

  if (object instanceof Error) {
    try {
      return (
        (object instanceof ScriptLabError ? object.message + ':' : 'Error:') +
        '\n' +
        jsonStringify(object)
      );
    } catch (e) {
      return stringifyPlusPlus(object.toString(), options);
    }
  }

  if (object.toString() !== '[object Object]') {
    return object.toString();
  }

  // Otherwise, stringify the object
  return jsonStringify(object);

  ////////////////////////////////////

  // Helpers:
  function jsonStringify(object: any): string {
    let candidateString = JSON.stringify(
      object,
      (key, value) => {
        if (object instanceof Error && options.skipErrorStack && key === 'stack') {
          return undefined;
        }
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          return getStringifiableSnapshot(value);
        }
        return value;
      },
      4,
    );

    return candidateString;

    ///////////////////////////////////

    function getStringifiableSnapshot(object: any) {
      const snapshot: any = {};

      try {
        let current = object;

        do {
          const ownPropNames = Object.getOwnPropertyNames(current);
          ownPropNames.forEach(tryAddName);
          current = Object.getPrototypeOf(current);

          if (allNextPropertiesAlreadyExistOnSnapshot(current)) {
            current = null;
          }
        } while (current);

        return snapshot;
      } catch (e) {
        return object;
      }

      function allNextPropertiesAlreadyExistOnSnapshot(current: any): boolean {
        const snapshotProps = Object.keys(snapshot);

        for (const prop of Object.keys(current)) {
          if (snapshotProps.indexOf(prop) < 0) {
            return false;
          }
        }

        return true;
      }

      function tryAddName(name: string) {
        const hasOwnProperty = Object.prototype.hasOwnProperty;
        if (name.indexOf(' ') < 0 && !hasOwnProperty.call(snapshot, name)) {
          Object.defineProperty(snapshot, name, {
            configurable: true,
            enumerable: true,
            get: () => object[name],
          });
        }
      }
    }
  }

  function indentAll(text: string): string {
    return text
      .split('\n')
      .map(line => new Array(4).fill(' ').join('') + line)
      .join('\n');
  }

  function isEachObjectAPrimitiveType(objects: any[]): boolean {
    for (let i = 0; i < objects.length; i++) {
      if (!isPrimitive(objects[i])) {
        return false;
      }
    }

    return true;
  }
}

export function stringifyPlusPlusOrErrorMessage(object: any): string {
  try {
    return stringifyPlusPlus(object);
  } catch (e) {
    return UNABLE_TO_DISPLAY_OBJECT_DEFAULT_MESSAGE;
  }
}

export function generateLogString(
  args: any[],
  severityType: ConsoleLogTypes,
): { severity: ConsoleLogTypes; message: string } {
  let message: string = '';
  let isSuccessfulMsg: boolean = true;
  args.forEach(element => {
    try {
      message += stringifyPlusPlus(element);
    } catch (e) {
      isSuccessfulMsg = false;
      message += UNABLE_TO_DISPLAY_OBJECT_DEFAULT_MESSAGE;
    }
    message += '\n';
  });

  if (message.length > 0) {
    message = message.trim();
  }

  return {
    message,
    severity: isSuccessfulMsg ? severityType : 'error',
  };
}
