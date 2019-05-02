import React from 'react';

import { AwaitPromiseThenRender } from 'common/lib/components/PageSwitcher/utilities/AwaitPromiseThenRender';
import { RunOnLoad } from 'common/lib/components/PageSwitcher/utilities/RunOnLoad';
import setup from './setup';
import { addScriptTag } from 'common/lib/utilities/script-loader';
import { SCRIPT_URLS } from 'common/lib/constants';
import { currentEditorUrl } from 'common/lib/environment';

const CustomFunctionsRunner = () => (
  <AwaitPromiseThenRender
    promise={addScriptTag(SCRIPT_URLS.GET_CUSTOM_FUNCTIONS_RUNNER(currentEditorUrl)).then(
      () => {
        (CustomFunctions as any).delayInitialization();
      },
    )}
  >
    <RunOnLoad funcToRun={setup} />
  </AwaitPromiseThenRender>
);

export default CustomFunctionsRunner;
