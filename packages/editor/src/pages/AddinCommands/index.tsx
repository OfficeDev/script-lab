import React from 'react';
import { SCRIPT_URLS } from 'common/lib/constants';
import { addScriptTags } from 'common/lib/utilities/script-loader';

import { RunOnLoad } from 'common/lib/components/PageSwitcher/utilities/RunOnLoad';
import { AwaitPromiseThenRender } from 'common/lib/components/PageSwitcher/utilities/AwaitPromiseThenRender';
import { hideSplashScreen } from 'common/lib/utilities/splash.screen';

import { ensureOfficeReadyAndRedirectIfNeeded } from 'common/lib/utilities/environment.redirector';
import setup from './setup';

const AddinCommands = () => (
  <AwaitPromiseThenRender
    promise={addScriptTags([SCRIPT_URLS.DEFAULT_OFFICE_JS])
      .then(() =>
        ensureOfficeReadyAndRedirectIfNeeded({
          isMainDomain: true /* true for the Editor */,
        }),
      )
      .then(() => hideSplashScreen())}
  >
    <RunOnLoad funcToRun={setup} />
  </AwaitPromiseThenRender>
);

export default AddinCommands;
