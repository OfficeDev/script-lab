import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import App from '../App'
import { StyledComponentsThemeProvider } from '../../theme'

export default ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <StyledComponentsThemeProvider>
        <App />
      </StyledComponentsThemeProvider>
    </ConnectedRouter>
  </Provider>
)
