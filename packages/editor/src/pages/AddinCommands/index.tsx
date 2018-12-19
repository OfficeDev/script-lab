import React from 'react';
import { SCRIPT_URLS } from 'common/lib/constants';
import { addScriptTags } from 'common/lib/utilities/script-loader';

import { RunOnLoad } from '../utilities/RunOnLoad';
import { AwaitPromiseThenRender } from '../utilities/AwaitPromiseThenRender';
import setup from './setup';

const AddinCommands = () => (
  <AwaitPromiseThenRender
    promise={addScriptTags([SCRIPT_URLS.OFFICE_JS_FOR_EDITOR]).then(() =>
      Office.onReady(),
    )}
  >
    <RunOnLoad funcToRun={setup} />
  </AwaitPromiseThenRender>
);

export default AddinCommands;
