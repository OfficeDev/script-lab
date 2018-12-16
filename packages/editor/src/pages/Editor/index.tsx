import React from 'react';
import App from './components';

import { Provider } from 'react-redux';
import {
  loadState as loadStateFromLocalStorage,
  saveState as saveStateToLocalStorage,
} from './store/localStorage';
import {
  loadState as loadStateFromSessionStorage,
  saveState as saveStateToSessionStorage,
} from './store/sessionStorage';

import configureStore from './store/configureStore';
import throttle from 'lodash/throttle';

const store = configureStore({
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

const Editor = () => (
  <Provider store={store}>
    <App />
  </Provider>
);
export default Editor;
