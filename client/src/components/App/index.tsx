import React from 'react'
import { Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import IDE from '../../containers/IDE'

const App = ({ theme }) => (
  <ThemeProvider theme={theme}>
    <Route exact path="/:solutionId?/:fileId?" component={IDE} />
  </ThemeProvider>
)

export default App
