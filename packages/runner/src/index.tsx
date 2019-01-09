import 'common/lib/polyfills';
window.onerror = error => invokeGlobalErrorHandler(error);

import redirectToProperEnvIfNeeded from 'common/lib/utilities/environment.redirector';
const isRedirectingAway = redirectToProperEnvIfNeeded();

import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import Pages from './pages';

import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';

if (!isRedirectingAway) {
  (async () => {
    try {
      ReactDOM.render(<Pages />, document.getElementById('root') as HTMLElement);
    } catch (e) {
      invokeGlobalErrorHandler(e);
    }
  })();
}