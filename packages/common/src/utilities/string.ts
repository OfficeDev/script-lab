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
