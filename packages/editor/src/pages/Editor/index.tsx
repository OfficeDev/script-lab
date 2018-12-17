import { SCRIPT_URLS } from 'common/lib/constants';
import { addScriptTags } from 'common/lib/utilities/script-loader';
// todo hwo to do async?

import React, { Component } from 'react';
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

interface IState {
  hasLoadedScripts: boolean;
}

class Editor extends Component<{}, IState> {
  state: IState = { hasLoadedScripts: false };

  constructor(props: any) {
    super(props);
    addScriptTags([SCRIPT_URLS.OFFICE_JS_FOR_EDITOR, SCRIPT_URLS.MONACO_LOADER])
      .then(() => Office.onReady())
      .then(() => this.setState({ hasLoadedScripts: true }));
  }

  render() {
    const { hasLoadedScripts } = this.state;
    return hasLoadedScripts ? (
      <Provider store={store}>
        <App />
      </Provider>
    ) : null;
  }
}

export default Editor;
