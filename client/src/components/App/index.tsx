import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import IDE from '../IDE'
import Backstage from '../Backstage'

import CustomFunctionsDashboard from '../CustomFunctionsDashboard'

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
    <>
      <Route exact path="/backstage" component={Backstage} />
      <Route exact path="/custom-functions" component={CustomFunctionsDashboard} />
      {/* <Route exact path="/editor/:solutionId?/:fileId?" component={IDE} /> */}
      <IDE />
    </>
  </ThemeProvider>
)

export default connect(mapStateToProps)(App)
