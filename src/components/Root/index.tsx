import React from 'react'
import { Provider } from 'react-redux'
import App from '../App'
import { StyledComponentsThemeProvider } from '../../theme'

const Root = ({ store }) => (
  <Provider store={store}>
    <StyledComponentsThemeProvider>
      <App />
    </StyledComponentsThemeProvider>
  </Provider>
)

export default Root
