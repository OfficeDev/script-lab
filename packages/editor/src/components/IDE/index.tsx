import React from 'react';
import { PATHS } from '../../constants';
import { Route, Switch } from 'react-router-dom';

import Main from './Main';
import Backstage from '../Backstage'; // TODO: (nicobell): move backstage to IDE folder

const IDE = () => (
  <>
    <Route exact path={PATHS.BACKSTAGE} component={Backstage} />
    <Main />
  </>
);

export default IDE;
