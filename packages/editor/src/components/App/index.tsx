import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import IDE from '../IDE';
import CustomFunctionsDashboard from '../CustomFunctionsDashboard';

import selectors from '../../store/selectors';
import { IState } from '../../store/reducer';
import { getTheme } from '../../theme';
import { PATHS } from '../../constants';

interface IPropsFromRedux {
  theme: ITheme;
}

const mapStateToProps = (state: IState): IPropsFromRedux => ({
  theme: getTheme(selectors.host.get(state)),
});

export interface IProps extends IPropsFromRedux {}

const App = ({ theme }: IProps) => (
  <ThemeProvider theme={theme}>
    <Switch>
      <Route exact path={PATHS.CUSTOM_FUNCTIONS} component={CustomFunctionsDashboard} />
      <Route component={IDE} />
    </Switch>
  </ThemeProvider>
);

export default connect(mapStateToProps)(App);
