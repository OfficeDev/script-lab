import 'common/lib/polyfills';
import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';

import './index.css';

/// ////////////////////////////////////

import React from 'react';
import ReactDOM from 'react-dom';

import Pages from './pages';

window.onerror = error => invokeGlobalErrorHandler(error);

(async () => {
  try {
    ReactDOM.render(<Pages />, document.getElementById('root'));
  } catch (e) {
    invokeGlobalErrorHandler(e);
  }
})();
