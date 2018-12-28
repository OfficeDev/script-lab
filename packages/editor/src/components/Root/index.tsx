import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import ScreenSizeMonitor from '../ScreenSizeMonitor';

export default ({ store, history, ui }) => (
  <Provider store={store}>
    <>
      <ScreenSizeMonitor />
      <ConnectedRouter history={history}>{ui}</ConnectedRouter>
    </>
  </Provider>
);
