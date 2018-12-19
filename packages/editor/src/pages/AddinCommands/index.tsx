import React from 'react';
import { SCRIPT_URLS } from 'common/lib/constants';
import { addScriptTags } from 'common/lib/utilities/script-loader';

import { RunOnLoad } from 'common/lib/components/PageSwitcher/utilities/RunOnLoad';
import { AwaitPromiseThenRender } from 'common/lib/components/PageSwitcher/utilities/AwaitPromiseThenRender';
import { hideLoadingIndicator } from 'common/lib/components/PageSwitcher/utilities/loadingIndicator';

import setup from './setup';

const AddinCommands = () => (
  <AwaitPromiseThenRender
    promise={addScriptTags([SCRIPT_URLS.OFFICE_JS_FOR_EDITOR])
      .then(() => Office.onReady())
      .then(() => hideLoadingIndicator())}
  >
    <RunOnLoad funcToRun={setup} />
  </AwaitPromiseThenRender>
);

export default AddinCommands;
