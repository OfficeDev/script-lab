import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import { Authenticator } from '@microsoft/office-js-helpers';
import configureStore from './store/configureStore';
import { setupFabricTheme } from './theme';
import { unregister } from './registerServiceWorker';
import { misc } from './store/actions';
import selectors from './store/selectors';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import createHashHistory from 'history/createHashHistory';
import {
  loadState as loadStateFromLocalStorage,
  saveState as saveStateToLocalStorage,
} from './store/localStorage';
import {
  loadState as loadStateFromSessionStorage,
  saveState as saveStateToSessionStorage,
} from './store/sessionStorage';

import throttle from 'lodash/throttle';

import './index.css';
import Root from './components/Root';
import App from './components/App';

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

Office.onReady(async () => {
  if (Authenticator.isAuthDialog()) {
    return;
  }
  initializeIcons();

  const { store, history } = configureStore({
    history: createHashHistory(),
    initialState: {
      ...loadStateFromLocalStorage(),
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
  store.dispatch(misc.initialize());

  ReactDOM.render(
    <Root store={store} history={history} ui={<App />} />,
    document.getElementById('root') as HTMLElement,
  );

  unregister(); // need more testing to determine if this can be removed. seems to help with the caching of the html file issues
});
