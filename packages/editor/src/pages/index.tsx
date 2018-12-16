import React from 'react';

import { HashRouter, Route, Switch } from 'react-router-dom';
import { PATHS } from '../constants';

import CustomFunctions from './CustomFunctions';
import Editor from './Editor';
import Heartbeat from './Heartbeat';
import Run from './Run';

// Note: To add a page you must add the path for the page in
// src/constants.ts and the key must be the same!
export const Pages = {
  CustomFunctions,
  Editor,
  Heartbeat,
  Run,
};

const PageSwitcher = () => (
  <HashRouter>
    <Switch>
      {/* Render a route for each page */}
      {Object.keys(Pages).map(page => (
        <Route exact path={PATHS[page]} component={Pages[page]} key={page} />
      ))}
      {/* Falling back on the IDE for an unknown route */}
      <Route component={Pages.Editor} />
    </Switch>
  </HashRouter>
);

export default PageSwitcher;
