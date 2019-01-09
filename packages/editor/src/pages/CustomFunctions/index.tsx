import { SCRIPT_URLS } from 'common/lib/constants';
import { addScriptTags } from 'common/lib/utilities/script-loader';

import React from 'react';

import App from './components/App';
import CustomFunctionsDashboard from './components/CustomFunctionsDashboard';
import Theme from 'common/lib/components/Theme';
import { Utilities } from '@microsoft/office-js-helpers';
import { AwaitPromiseThenRender } from 'common/lib/components/PageSwitcher/utilities/AwaitPromiseThenRender';
import { hideSplashScreen } from 'common/lib/utilities/splash.screen';

const CFD = App(CustomFunctionsDashboard);

const CustomFunctions = () => (
  <AwaitPromiseThenRender
    promise={addScriptTags([SCRIPT_URLS.OFFICE_JS_FOR_CUSTOM_FUNCTIONS_DASHBOARD])
      .then(() => Office.onReady())
      .then(() => hideSplashScreen())}
  >
    <Theme host={Utilities.host}>
      <CFD />
    </Theme>
  </AwaitPromiseThenRender>
);

export default CustomFunctions;
