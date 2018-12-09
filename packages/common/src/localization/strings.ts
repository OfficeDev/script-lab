export function getFakeString(text: string) {
  return getFakeStringHelper(text, null);
}

export function getFakeStringLong(text: string) {
  return getFakeStringHelper(text, (currentLetter, uppercaseIt) => {
    const regexLettersToElongate = /[AOE]/i;
    if (regexLettersToElongate.test(currentLetter)) {
      return currentLetter[uppercaseIt ? 'toUpperCase' : 'toLowerCase']().repeat(2);
    } else {
      return '';
    }
  });
}

export function getFakeStringHelper(
  text: string,
  letterAddingCallback?: (currentLetter: string, uppercaseIt: boolean) => string,
) {
  let result = '';
  const regexAnythingUntilWords = /^([^a-zA-Z\-]*)([a-zA-Z\-]+)(.*)$/;
  while (text.length > 0) {
    const match = regexAnythingUntilWords.exec(text);
    if (match) {
      result += match[1] + processWord(match[2]);
      text = match[3];
    } else {
      result += text;
      text = '';
    }
  }

  return result;

  // Helper:
  function processWord(word: string) {
    const regexUppercase = /[A-Z]/;

    let processedWord = '';
    for (let i = 0; i < word.length; i++) {
      const originalLetter = word[i];
      const correspondingLetter = word.substr(word.length - 1 - i, 1);
      const newLetter = correspondingLetter[
        regexUppercase.test(originalLetter) ? 'toUpperCase' : 'toLowerCase'
      ]();
      processedWord += newLetter;
    }

    if (letterAddingCallback) {
      let i = 0;
      while (i < processedWord.length) {
        const currentLetter = processedWord[i];
        let nextLetterUppercase: boolean;
        if (i === processedWord.length - 1) {
          nextLetterUppercase = regexUppercase.test(currentLetter);
        } else {
          nextLetterUppercase =
            regexUppercase.test(currentLetter) &&
            regexUppercase.test(processedWord.substr(i + 1, 1));
        }
        const lettersToAdd = letterAddingCallback(currentLetter, nextLetterUppercase);
        processedWord =
          processedWord.substr(0, i + 1) + lettersToAdd + processedWord.substr(i + 1);
        i = i + 1 + lettersToAdd.length;
      }
    }

    return processedWord;
  }
}
