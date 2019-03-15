import React from 'react';

import { parse } from 'query-string';
import { SCRIPT_URLS } from 'common/lib/constants';
import { OFFICE_JS_URL_QUERY_PARAMETER_KEY } from 'common/lib/utilities/script-loader/constants';
import { addScriptTags } from 'common/lib/utilities/script-loader';
import { ensureOfficeReadyAndRedirectIfNeeded } from 'common/lib/utilities/environment.redirector';
import { AwaitPromiseThenRender } from 'common/lib/components/PageSwitcher/utilities/AwaitPromiseThenRender';

import App from './components/App';

function getOfficeJsUrlToLoad(): string {
  const params = parse(window.location.search) as {
    [OFFICE_JS_URL_QUERY_PARAMETER_KEY]: string;
  };

  return (params[OFFICE_JS_URL_QUERY_PARAMETER_KEY] || '').trim().length > 0
    ? params[OFFICE_JS_URL_QUERY_PARAMETER_KEY]
    : SCRIPT_URLS.DEFAULT_OFFICE_JS;
}

const Runner = () => (
  <AwaitPromiseThenRender
    promise={addScriptTags([getOfficeJsUrlToLoad()]).then(() =>
      ensureOfficeReadyAndRedirectIfNeeded({
        isMainDomain: false /* false for the Runner */,
      }),
    )}
  >
    <App />
  </AwaitPromiseThenRender>
);

export default Runner;
