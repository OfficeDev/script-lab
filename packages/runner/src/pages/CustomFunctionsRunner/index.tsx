import React from 'react';

import { AwaitPromiseThenRender } from 'common/lib/components/PageSwitcher/utilities/AwaitPromiseThenRender';
import { RunOnLoad } from 'common/lib/components/PageSwitcher/utilities/RunOnLoad';
import setup from './setup';
import { addScriptTag } from 'common/lib/utilities/script-loader';
import { SCRIPT_URLS } from 'common/lib/constants';

const CustomFunctionsRunner = () => (
  <AwaitPromiseThenRender
    promise={addScriptTag(SCRIPT_URLS.CUSTOM_FUNCTIONS_RUNNER).then(() => {
      (CustomFunctions as any).delayInitialization();
    })}
  >
    <RunOnLoad funcToRun={setup} />
  </AwaitPromiseThenRender>
);

export default CustomFunctionsRunner;
