import 'common/lib/polyfills';
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import Pages from './pages';

import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';

window.onerror = error => invokeGlobalErrorHandler(error);

(async () => {
  try {
    ReactDOM.render(<Pages />, document.getElementById('root') as HTMLElement);
  } catch (e) {
    invokeGlobalErrorHandler(e);
  }
})();
