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
    promise={Promise.resolve()
      .then(() => Office.onReady())
      .then(() => hideSplashScreen())}
  >
    <Theme host={Utilities.host}>
      <CFD />
    </Theme>
  </AwaitPromiseThenRender>
);

export default CustomFunctions;
