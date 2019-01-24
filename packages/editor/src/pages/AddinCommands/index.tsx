import React from 'react';

import { RunOnLoad } from 'common/lib/components/PageSwitcher/utilities/RunOnLoad';
import { AwaitPromiseThenRender } from 'common/lib/components/PageSwitcher/utilities/AwaitPromiseThenRender';
import { hideSplashScreen } from 'common/lib/utilities/splash.screen';

import setup from './setup';

const AddinCommands = () => (
  <AwaitPromiseThenRender
    promise={Promise.resolve()
      .then(() => Office.onReady())
      .then(() => hideSplashScreen())}
  >
    <RunOnLoad funcToRun={setup} />
  </AwaitPromiseThenRender>
);

export default AddinCommands;
