import React from 'react';

import PageSwitcher from 'common/lib/components/PageSwitcher';
import { PATHS } from '../constants';

import Auth from './Auth';
import AddinCommands from './AddinCommands';
import CustomFunctions from './CustomFunctions';
import CustomFunctionsHeartbeat from './CustomFunctionsHeartbeat';
import CustomFunctionsRun from './CustomFunctionsRun';
import Editor from './Editor';
import External from './External';
import Heartbeat from './Heartbeat';
import Run from './Run';

// Note: To add a page you must add the path for the page in
// src/constants.ts and the key must be the same!
const pages = {
  Auth,
  AddinCommands,
  CustomFunctions,
  CustomFunctionsHeartbeat,
  CustomFunctionsRun,
  Editor,
  External,
  Heartbeat,
  Run,
};

export default () => (
  <PageSwitcher pages={pages} paths={PATHS} defaultComponent={pages.Editor} />
);
