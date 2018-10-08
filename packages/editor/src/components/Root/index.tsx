import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import App from '../App'
import WidthMonitor from '../WidthMonitor'

export default ({ store, history }) => (
  <Provider store={store}>
    <>
      <WidthMonitor />
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </>
  </Provider>
)
