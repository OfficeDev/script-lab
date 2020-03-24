import React from 'react';

import safeExternalUrls from 'common/lib/safe.external.urls';

import { RunOnLoad } from 'common/lib/components/PageSwitcher/utilities/RunOnLoad';

function setup() {
  // Note: using just an indexOf of whatever follows "#/external-page?destination="
  //    rather than doping an actual search string query.
  //    This is because, as part of launching the dialog, Office.js prepends a bunch
  //    of stuff on the URL as a query string (?_host_Info=) BEFORE the hash,
  //    and doesn't seem to want a URL with an existing query string in there.
  //    So we can't do a regular `parse(window.location.search)`
  //    This means that the final URL ends up with two "?" on the URL,
  //    which -- though weird -- seems to work just fine.
  const href = window.location.href;
  const searchFor = '#/external-page?destination=';
  const indexOf = href.indexOf(searchFor);
  if (indexOf < 0) {
    // This should never happen.  If it does, just quit and leave a blank progress spinner.
    return;
  }

  const destination = decodeURIComponent(href.substr(indexOf + searchFor.length));

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
