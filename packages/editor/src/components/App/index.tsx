import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import IDE from '../IDE';
import Backstage from '../Backstage';

import CustomFunctionsDashboard from '../CustomFunctionsDashboard';

import selectors from '../../store/selectors';
import { getTheme } from '../../theme';
import { PATHS } from '../../constants';

interface IPropsFromRedux {
  theme: ITheme;
}

const mapStateToProps = (state): IPropsFromRedux => ({
  theme: getTheme(selectors.host.get(state)),
});

export interface IProps extends IPropsFromRedux {}

const App = ({ theme }: IProps) => (
  <ThemeProvider theme={theme}>
    <Switch>
      <Route exact path={PATHS.CUSTOM_FUNCTIONS} component={CustomFunctionsDashboard} />
      <Route component={BackstageAndIDE} />
    </Switch>
  </ThemeProvider>
);

const BackstageAndIDE = () => (
  <>
    <Route exact path={PATHS.BACKSTAGE} component={Backstage} />
    <IDE />
  </>
);

export default connect(mapStateToProps)(App);
