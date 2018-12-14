import 'common/lib/polyfills';

import redirectToProperEnvIfNeeded from './utils/stagingEnvironmentRedirector';
redirectToProperEnvIfNeeded();

import React from 'react';
import ReactDOM from 'react-dom';
import { Authenticator } from '@microsoft/office-js-helpers';
import configureStore from './pages/Editor/store/configureStore';
import { setupFabricTheme } from './theme';
import { unregister } from './registerServiceWorker';
import { misc } from './pages/Editor/store/actions';
import selectors from './pages/Editor/store/selectors';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import createHashHistory from 'history/createHashHistory';
import {
  loadState as loadStateFromLocalStorage,
  saveState as saveStateToLocalStorage,
} from './pages/Editor/store/localStorage';
import {
  loadState as loadStateFromSessionStorage,
  saveState as saveStateToSessionStorage,
} from './pages/Editor/store/sessionStorage';

import throttle from 'lodash/throttle';

import './index.css';
import Root from './components/Root';
import App from './components/App';
import { waitForAllDynamicScriptsToBeLoaded } from 'common/lib/utilities/script-loader/consumer';
import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';
import { IState } from './pages/Editor/store/reducer';

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
    initializeIcons();

    const store = configureStore({
      initialState: {
        ...(await loadStateFromLocalStorage()),
        ...loadStateFromSessionStorage(),
      },
    });

    store.subscribe(
      throttle(() => {
        const state = store.getState();
        saveStateToLocalStorage(state);
        saveStateToSessionStorage(state);
      }, 1000),
    );

    setupFabricTheme(selectors.host.get(store.getState()));

    // initial actions
    // TODO: move this to editor
    // store.dispatch(misc.initialize());

    ReactDOM.render(
      <Root store={store} history={history} ui={<App />} />,
      document.getElementById('root') as HTMLElement,
    );

    unregister(); // need more testing to determine if this can be removed. seems to help with the caching of the html file issues
  } catch (e) {
    invokeGlobalErrorHandler(e);
  }
})();
