import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import IDE from '../IDE'
import Backstage from '../Backstage'

import CustomFunctionsDashboard from '../CustomFunctionsDashboard'

import selectors from '../../store/selectors'
import { getTheme } from '../../theme'
import { PATHS } from '../../constants'

interface IPropsFromRedux {
  theme: ITheme
}

const mapStateToProps = (state): IPropsFromRedux => ({
  theme: getTheme(selectors.host.get(state)),
})

export interface IProps extends IPropsFromRedux {}

const App = ({ theme }: IProps) => (
  <ThemeProvider theme={theme}>
    <>
      <Route exact path={PATHS.BACKSTAGE} component={Backstage} />
      <Route
        exact
        path={'/(custom-functions|custom-functions-dashboard)/'}
        component={CustomFunctionsDashboard}
      />
      <IDE />
    </>
  </ThemeProvider>
)

export default connect(mapStateToProps)(App)
