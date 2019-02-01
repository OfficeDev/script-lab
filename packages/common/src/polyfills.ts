import 'react-app-polyfill/ie11';
import 'core-js';

if (!window.crypto) {
  (window as any).crypto = (window as any).msCrypto;
}
