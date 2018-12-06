import 'common/lib/polyfills';
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './components/App';

import { waitForAllDynamicScriptsToBeLoaded } from 'common/lib/utilities/script-loader/consumer';
import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';

window.onerror = error => invokeGlobalErrorHandler(error);

(async () => {
  try {
    await waitForAllDynamicScriptsToBeLoaded();
    await Office.onReady();
    ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
  } catch (e) {
    invokeGlobalErrorHandler(e);
  }
})();
