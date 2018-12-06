import { parse } from 'query-string';
import { SCRIPT_URLS } from '../../../common/src/constants';
import { OFFICE_JS_URL_QUERY_PARAMETER_KEY } from '../../../common/src/utilities/script-loader/constants';
import { addScriptTags } from '../../../common/src/utilities/script-loader/precompile';

addScriptTags([getOfficeJsUrlToLoad()]);

//////////////////////////////

// Helpers
function getOfficeJsUrlToLoad(): string {
  const params = parse(window.location.search) as {
    [OFFICE_JS_URL_QUERY_PARAMETER_KEY]: string;
  };

  return (params[OFFICE_JS_URL_QUERY_PARAMETER_KEY] || '').trim().length > 0
    ? params[OFFICE_JS_URL_QUERY_PARAMETER_KEY]
    : SCRIPT_URLS.OFFICE_JS_FOR_EDITOR;
}
