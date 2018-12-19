import React from 'react';

import { HashRouter, Route, Switch } from 'react-router-dom';
import { PATHS } from '../constants';

import AddinCommands from './AddinCommands';
import CustomFunctions from './CustomFunctions';
import CustomFunctionsHeartbeat from './CustomFunctionsHeartbeat';
import CustomFunctionsRun from './CustomFunctionsRun';
import Editor from './Editor';
import Heartbeat from './Heartbeat';
import Run from './Run';

// Note: To add a page you must add the path for the page in
// src/constants.ts and the key must be the same!
export const Pages = {
  AddinCommands,
  Editor,
  CustomFunctions,
  CustomFunctionsHeartbeat,
  CustomFunctionsRun,
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
