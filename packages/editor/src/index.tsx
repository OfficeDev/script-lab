import 'common/lib/polyfills';
window.onerror = error => invokeGlobalErrorHandler(error);

import * as log from 'common/lib/utilities/log';
log.initializeLoggers();

import redirectToProperEnvIfNeeded from 'common/lib/utilities/environment.redirector';
const isRedirectingAwayPromise = redirectToProperEnvIfNeeded();

import React from 'react';
import ReactDOM from 'react-dom';
import { Authenticator } from '@microsoft/office-js-helpers';
import { unregister } from './registerServiceWorker';

import './index.css';

import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';

import Pages from './pages';
import { init as initConfig } from './utils/config';

(async () => {
  const isRedirectingAway = await isRedirectingAwayPromise;
  if (!isRedirectingAway) {
    try {
      if (Authenticator.isAuthDialog()) {
        return;
      }

      // Add a keyboard listener to [try to] intercept "ctrl+save", since we auto-save anyway
      // and since the browser/host "save as" dialog would be unwanted here
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

      initConfig();

      ReactDOM.render(<Pages />, document.getElementById('root') as HTMLElement);

      unregister(); // need more testing to determine if this can be removed. seems to help with the caching of the html file issues
    } catch (e) {
      invokeGlobalErrorHandler(e);
    }
  }
})();
