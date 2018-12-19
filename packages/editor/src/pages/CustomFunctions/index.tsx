import { SCRIPT_URLS } from 'common/lib/constants';
import { addScriptTags } from 'common/lib/utilities/script-loader';

import React from 'react';

import App from './components/App';
import CustomFunctionsDashboard from './components/CustomFunctionsDashboard';
import Theme from 'common/lib/components/Theme';
import { Utilities } from '@microsoft/office-js-helpers';
import { AwaitPromiseThenRender } from '../utilities/AwaitPromiseThenRender';

const CFD = App(CustomFunctionsDashboard);

const CustomFunctions = () => (
  <AwaitPromiseThenRender
    promise={addScriptTags([SCRIPT_URLS.OFFICE_JS_FOR_CUSTOM_FUNCTIONS_DASHBOARD])
      .then(() => Office.onReady())
      .then(() => {
        const loadingIndicator = document.getElementById('loading')!;
        loadingIndicator.style.visibility = 'hidden';
      })}
  >
    <Theme host={Utilities.host}>
      <CFD />
    </Theme>
  </AwaitPromiseThenRender>
);

export default CustomFunctions;
