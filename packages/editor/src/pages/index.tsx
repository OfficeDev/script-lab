import React from 'react';

import PageSwitcher, { IPageLoadingSpec } from 'common/lib/components/PageSwitcher';
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
import { SCRIPT_URLS } from 'common/lib/constants';

// Note: To add a page you must add the path for the page in
// src/constants.ts add it into the structure below:
const pages: { [key: string]: IPageLoadingSpec } = {
  [PATHS.Auth]: {
    component: Auth,
    officeJs: null /* is a browser-only page for auth, doesn't need Office.js */,
  },
  [PATHS.AddinCommands]: {
    component: AddinCommands,
    officeJs: SCRIPT_URLS.DEFAULT_OFFICE_JS,
    skipOfficeOnReady: true /* skip calling "Office.onReady" until the functions are registered.
      The component's setup will then call it itself */,
    skipRedirect: true /* skip redirecting. It won't work for add-in commands anyway,
      and the logic is so simple we can just always rely on the prod version */,
  },
  [PATHS.CustomFunctions]: {
    component: CustomFunctions,
    officeJs: SCRIPT_URLS.OFFICE_JS_FOR_CUSTOM_FUNCTIONS_DASHBOARD,
  },
  [PATHS.CustomFunctionsHeartbeat]: {
    component: CustomFunctionsHeartbeat,
    officeJs: null /* runs in an iframe, doesn't need Office.js */,
  },
  [PATHS.CustomFunctionsRun]: {
    component: CustomFunctionsRun,
    officeJs: null /* does a window.location redirect, doesn't need Office.js */,
  },
  [PATHS.Editor]: {
    component: Editor,
    isRedirectCancelable: true,
    officeJs: SCRIPT_URLS.DEFAULT_OFFICE_JS,
  },
  [PATHS.External]: {
    component: External,
    officeJs: SCRIPT_URLS.DEFAULT_OFFICE_JS, // Need Office.js so that
    //   can message back to parent taskpane to close the dialog
  },
  [PATHS.Heartbeat]: {
    component: Heartbeat,
    officeJs: null /* runs in an iframe, doesn't need Office.js */,
  },
  [PATHS.Run]: {
    component: Run,
    officeJs: null /* does a window.location redirect, doesn't need Office.js */,
  },
};

export default () => <PageSwitcher pages={pages} defaultPath={PATHS.Editor} />;
