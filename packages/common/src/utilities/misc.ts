export function isInternetExplorer(): boolean {
  // From https://stackoverflow.com/a/19868056/678505
  return 'ActiveXObject' in window;
}

export function generateCryptoSafeRandom(): number {
  const random = new Uint32Array(1);

  // Note: NOT polyfilling all of "window.crypto" with "window.msCrypto"
  // in polyfills.ts,  because not all functionality is the same.
  // But this one method does exist on both:
  ((window.crypto || (window as any).msCrypto) as Crypto).getRandomValues(random);
  return random[0];
}
