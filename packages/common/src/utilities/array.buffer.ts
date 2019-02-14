export function bufferToNumericString(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map(value => /* pad with 0s */ ('000' + value).slice(-3))
    .join('');
}

export function numericStringToBuffer(input: string) {
  const numbers = input.match(/.{1,3}/g).map(item => parseInt(item, 10));
  const buffer = new ArrayBuffer(numbers.length);
  const uint8array = new Uint8Array(buffer);
  numbers.forEach((num, index) => (uint8array[index] = num));
  return buffer;
}

export function unicodeStringToBuffer(input: string) {
  const buffer = new ArrayBuffer(input.length * 2); // 2 bytes for each char
  const uint16arr = new Uint16Array(buffer);
  for (let i = 0; i < input.length; i++) {
    uint16arr[i] = input.charCodeAt(i);
  }
  return buffer;
}

export function bufferToUnicodeString(buffer: ArrayBuffer) {
  return String.fromCharCode.apply(null, Array.from(new Uint16Array(buffer)));
}
