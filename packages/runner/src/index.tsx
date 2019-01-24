import 'common/lib/polyfills';
window.onerror = error => invokeGlobalErrorHandler(error);

import redirectToProperEnvIfNeeded from 'common/lib/utilities/environment.redirector';
const isRedirectingAwayPromise = redirectToProperEnvIfNeeded();

import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import Pages from './pages';

import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';

(async () => {
  const isRedirectingAway = await isRedirectingAwayPromise;
  if (!isRedirectingAway) {
    try {
      ReactDOM.render(<Pages />, document.getElementById('root') as HTMLElement);
    } catch (e) {
      invokeGlobalErrorHandler(e);
    }
  }
})();
