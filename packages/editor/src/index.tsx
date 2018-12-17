import 'common/lib/polyfills';

import redirectToProperEnvIfNeeded from './utils/stagingEnvironmentRedirector';
redirectToProperEnvIfNeeded();

import React from 'react';
import ReactDOM from 'react-dom';
import { Authenticator } from '@microsoft/office-js-helpers';
import { unregister } from './registerServiceWorker';

import './index.css';

import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';

import PageSwitcher from './pages';

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

window.onerror = error => invokeGlobalErrorHandler(error);

(async () => {
  try {
    // await waitForAllDynamicScriptsToBeLoaded();
    // await Office.onReady();
    if (Authenticator.isAuthDialog()) {
      return;
    }

    // initial actions
    // TODO: move this to editor
    // store.dispatch(misc.initialize());

    ReactDOM.render(<PageSwitcher />, document.getElementById('root') as HTMLElement);

    unregister(); // need more testing to determine if this can be removed. seems to help with the caching of the html file issues
  } catch (e) {
    invokeGlobalErrorHandler(e);
  }
})();
