import { bufferToHexString } from './array.buffer';

export function isInternetExplorer(): boolean {
  // From https://stackoverflow.com/a/19868056/678505
  return 'ActiveXObject' in window;
}

export function generateRandomToken(bits = 128): string {
  if (bits % 8 !== 0) {
    throw new Error('generateRandomToken - bits must be in multiples of 8');
  }

  const buffer = new Uint8Array(bits / 8);

  // Note: NOT polyfilling all of "window.crypto" with "window.msCrypto"
  // in polyfills.ts, because not all functionality is the same.
  // But this method does exist on both:
  const crypto: Crypto = window.crypto || (window as any).msCrypto;

  crypto.getRandomValues(buffer);
  return bufferToHexString(buffer);
}

export function pause(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
