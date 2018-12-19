import 'common/lib/polyfills';
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './components/App';

import { parse } from 'query-string';
import { SCRIPT_URLS } from 'common/src/constants';
import { OFFICE_JS_URL_QUERY_PARAMETER_KEY } from 'common/src/utilities/script-loader/constants';
import { addScriptTags } from 'common/src/utilities/script-loader';

import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';

window.onerror = error => invokeGlobalErrorHandler(error);

function getOfficeJsUrlToLoad(): string {
  const params = parse(window.location.search) as {
    [OFFICE_JS_URL_QUERY_PARAMETER_KEY]: string;
  };

  return (params[OFFICE_JS_URL_QUERY_PARAMETER_KEY] || '').trim().length > 0
    ? params[OFFICE_JS_URL_QUERY_PARAMETER_KEY]
    : SCRIPT_URLS.OFFICE_JS_FOR_EDITOR;
}

(async () => {
  try {
    await addScriptTags([getOfficeJsUrlToLoad()]);
    await Office.onReady();
    ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
  } catch (e) {
    invokeGlobalErrorHandler(e);
  }
})();
