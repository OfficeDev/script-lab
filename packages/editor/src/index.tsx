import './polyfills';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Authenticator } from '@microsoft/office-js-helpers';
import configureStore from './store/configureStore';
import { setupFabricTheme } from './theme';
import registerServiceWorker, { unregister } from './registerServiceWorker';
import { misc } from './store/actions';
import selectors from './store/selectors';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

import './index.css';
import Root from './components/Root';
import { invokeGlobalErrorHandler } from './utils';
import { resolve } from 'path';
import { WINDOW_SCRIPT_LAB_IS_READY_KEY } from './constants';

document.addEventListener(
  'keydown',
  e => {
    if (
      e.keyCode === 83 /*s key*/ &&
      (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
    ) {
      e.preventDefault();
    }
  },
  false,
);

// Just in case, attach a global window.onerror.
// However, note that it doesn't catch Promise-based rejections, and also
//   doesn't report as much info on error objects -- so best
//   to still use try/catch-es or .catch-es where possible.
window.onerror = error => invokeGlobalErrorHandler(error);

(async () => {
  try {
    await waitForAllDynamicScriptsToBeLoaded();
    await Office.onReady();

    if (Authenticator.isAuthDialog()) {
      return;
    }
    initializeIcons();

    const { store, history } = configureStore();

    setupFabricTheme(selectors.host.get(store.getState()));

    // initial actions
    store.dispatch(misc.initialize());

    ReactDOM.render(<Root store={store} history={history} />, document.getElementById(
      'root',
    ) as HTMLElement);

    unregister(); // did this help? // TODO: MZ to Nico: what is this comment from?
  } catch (e) {
    invokeGlobalErrorHandler(e);
  }
})();

function waitForAllDynamicScriptsToBeLoaded(): Promise<void> {
  if ((window as any)[WINDOW_SCRIPT_LAB_IS_READY_KEY]) {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    const interval = setInterval(() => {
      if ((window as any)[WINDOW_SCRIPT_LAB_IS_READY_KEY]) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}
