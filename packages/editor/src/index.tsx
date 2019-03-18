import 'common/lib/polyfills';
import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';
window.onerror = error => invokeGlobalErrorHandler(error);

import './index.css';

///////////////////////////////////////

import React from 'react';
import ReactDOM from 'react-dom';
import { unregister } from './registerServiceWorker';
import queryString from 'query-string';

import Pages from './pages';
import AuthPage from './pages/Auth';
import { addScriptTags } from 'common/lib/utilities/script-loader';
import { SCRIPT_URLS } from 'common/lib/constants';
import { ensureOfficeReadyAndRedirectIfNeeded } from 'common/lib/utilities/environment.redirector';

(async () => {
  try {
    const rootElement = document.getElementById('root') as HTMLElement;

    await addScriptTags([SCRIPT_URLS.DEFAULT_OFFICE_JS]);
    await ensureOfficeReadyAndRedirectIfNeeded({
      isMainDomain: true /* true for the Editor */,
    });

    ReactDOM.render(getReactElementBasedOnQueryParams(), rootElement);

    unregister(); // need more testing to determine if this can be removed. seems to help with the caching of the html file issues
  } catch (e) {
    invokeGlobalErrorHandler(e);
  }
})();

///////////////////////////////////////

function getReactElementBasedOnQueryParams() {
  const params: { state?: string; code?: string } = queryString.parse(
    queryString.extract(window.location.href),
  );

  // For the GitHub auth callback, we've registered the root page.
  // To avoid needing to change it at the GitHub layer (and thus breaking it across
  // our redirected environments), it's best to stick with what the registration
  // already expects.  And so, if we see "state" and "code" on the URL --
  // which is a telltale sign of GitHub redirecting after successful auth --
  // got ahead and render the AuthPage component.
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
