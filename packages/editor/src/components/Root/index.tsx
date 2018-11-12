import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import App from '../App';
import ScreenSizeMonitor from '../ScreenSizeMonitor';

export default ({ store, history }) => (
  <Provider store={store}>
    <>
      <ScreenSizeMonitor />
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </>
  </Provider>
);
