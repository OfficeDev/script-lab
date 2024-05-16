export function bufferToHexString(buffer: ArrayBuffer | Uint8Array) {
  return Array.from(buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer))
    .map((value) => /* pad with, at most, two 0s */ ("00" + value.toString(16)).slice(-2))
    .join("");
}

export function hexStringToBuffer(input: string) {
  const numbers = input.match(/.{1,2}/g).map((item) => parseInt(item, 16));
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
