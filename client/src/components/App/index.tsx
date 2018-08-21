import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import IDE from '../IDE'

import selectors from '../../store/selectors'
import { getTheme } from '../../theme'

interface IPropsFromRedux {
  theme: ITheme
}

const mapStateToProps = (state): IPropsFromRedux => ({
  theme: getTheme(selectors.host.get(state)),
})

export interface IApp extends IPropsFromRedux {}

const App = ({ theme }: IApp) => (
  <ThemeProvider theme={theme}>
    <Route exact path="/:solutionId?/:fileId?" component={IDE} />
  </ThemeProvider>
)

export default connect(mapStateToProps)(App)
