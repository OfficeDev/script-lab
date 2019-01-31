export function isInternetExplorer(): boolean {
  // From https://stackoverflow.com/a/19868056/678505
  return 'ActiveXObject' in window;
}

export function generateCryptoSafeRandom(): number {
  const random = new Uint32Array(1);
  window.crypto.getRandomValues(random);
  return random[0];
}
