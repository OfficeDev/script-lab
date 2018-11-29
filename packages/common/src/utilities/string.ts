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

export function stringifyPlusPlus(object: any): string {
  if (object === null) {
    return 'null';
  }

  if (typeof object === 'undefined') {
    return 'undefined';
  }

  // Don't JSON.stringify strings, because we don't want quotes in the output
  if (typeof object === 'string') {
    return object;
  }

  if (object instanceof Error) {
    try {
      return 'Error: ' + '\n' + jsonStringify(object);
    } catch (e) {
      return stringifyPlusPlus(object.toString());
    }
  }
  if (object.toString() !== '[object Object]') {
    return object.toString();
  }

  // Otherwise, stringify the object
  return jsonStringify(object);

  ////////////////////////////////////

  // Helper:
  function jsonStringify(object: any): string {
    return JSON.stringify(
      object,
      (key, value) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          return getStringifiableSnapshot(value);
        }
        return value;
      },
      4,
    );

    function getStringifiableSnapshot(object: any) {
      const snapshot: any = {};

      try {
        let current = object;

        do {
          Object.getOwnPropertyNames(current).forEach(tryAddName);
          current = Object.getPrototypeOf(current);
        } while (current);

        return snapshot;
      } catch (e) {
        return object;
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
}
