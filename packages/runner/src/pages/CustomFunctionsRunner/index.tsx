import React from 'react';

import { AwaitPromiseThenRender } from 'common/lib/components/PageSwitcher/utilities/AwaitPromiseThenRender';
import { RunOnLoad } from 'common/lib/components/PageSwitcher/utilities/RunOnLoad';
import setup from './setup';
import { addScriptTags } from 'common/lib/utilities/script-loader';
import { SCRIPT_URLS } from 'common/lib/constants';

const CustomFunctionsRunner = () => (
  // TODO: see TODO in index.html
  // <AwaitPromiseThenRender
  //   promise={addScriptTags([SCRIPT_URLS.CUSTOM_FUNCTIONS_RUNNER])}
  // >
  <RunOnLoad funcToRun={setup} />
  // </AwaitPromiseThenRender>
);

export default CustomFunctionsRunner;
