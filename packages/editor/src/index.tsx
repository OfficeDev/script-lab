import 'common/lib/polyfills';

import redirectToProperEnvIfNeeded from './utils/stagingEnvironmentRedirector';
redirectToProperEnvIfNeeded();

import React from 'react';
import ReactDOM from 'react-dom';
import { Authenticator, Utilities } from '@microsoft/office-js-helpers';
import configureStore from './pages/Editor/store/configureStore';
import { unregister } from './registerServiceWorker';
import { misc } from './pages/Editor/store/actions';
import selectors from './pages/Editor/store/selectors';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import createHashHistory from 'history/createHashHistory';

import './index.css';

import { waitForAllDynamicScriptsToBeLoaded } from 'common/lib/utilities/script-loader/consumer';
import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';
import { IState } from './pages/Editor/store/reducer';

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
    await waitForAllDynamicScriptsToBeLoaded();
    await Office.onReady();
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
