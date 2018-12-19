import React from 'react';

import { parse } from 'query-string';
import safeExternalUrls from 'common/lib/safe.external.urls';

import { RunOnLoad } from 'common/lib/components/PageSwitcher/utilities/RunOnLoad';

function setup() {
  const { destination } = parse(window.location.search) as {
    destination: string;
  };

  for (const key in safeExternalUrls) {
    const value = (safeExternalUrls as { [key: string]: string })[key];
    if (value === destination) {
      window.location.href = destination;
      return;
    }
  }
  // Otherwise can just stay on empty page.  This should never happen in normal behavior,
  // and if someone tweaks the URL, then so be it.
}

const External = () => <RunOnLoad funcToRun={setup} />;

export default External;
