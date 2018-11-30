import 'common/lib/polyfills';
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './components/App';

import { waitForAllDynamicScriptsToBeLoaded } from 'common/lib/utilities/script.loader';
import invokeGlobalErrorHandler from 'common/lib/utilities/global.error.handler';

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
