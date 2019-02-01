import 'common/lib/polyfills';
import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';
window.onerror = error => invokeGlobalErrorHandler(error);

import redirectToProperEnvIfNeeded from 'common/lib/utilities/environment.redirector';
const isRedirectingAwayPromise = redirectToProperEnvIfNeeded();

import './index.css';

///////////////////////////////////////

import React from 'react';
import ReactDOM from 'react-dom';
import { unregister } from './registerServiceWorker';
import QueryString from 'query-string';

import Pages from './pages';
import AuthPage from './pages/Auth';

(async () => {
  const isRedirectingAway = await isRedirectingAwayPromise;
  if (!isRedirectingAway) {
    try {
      const rootElement = document.getElementById('root') as HTMLElement;

      ReactDOM.render(getReactElementBasedOnQueryParams(), rootElement);

      unregister(); // need more testing to determine if this can be removed. seems to help with the caching of the html file issues
    } catch (e) {
      invokeGlobalErrorHandler(e);
    }
  }
})();

///////////////////////////////////////

function getReactElementBasedOnQueryParams() {
  const params: { state?: string; code?: string } = QueryString.parse(
    QueryString.extract(window.location.href),
  );
  if (params.state && params.code) {
    return <AuthPage />;
  } else {
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

    return <Pages />;
  }
}
