import React from 'react';

import PageSwitcher from 'common/lib/components/PageSwitcher';
import { PATHS } from '../constants';

import CustomFunctionsRunner from './CustomFunctionsRunner';
import Runner from './Runner';

// Note: To add a page you must add the path for the page in
// src/constants.ts and the key must be the same!
const pages = {
  CustomFunctionsRunner,
  Runner,
};

export default () => (
  <PageSwitcher pages={pages} paths={PATHS} defaultComponent={pages.Runner} />
);
