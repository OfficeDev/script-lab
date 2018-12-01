import { parse } from 'query-string';
import {
  SCRIPT_URLS,
  OFFICE_JS_URL_QUERY_PARAMETER_KEY,
} from '../../../common/src/constants';
import { addScriptTag } from '../../../common/src/utilities/script.loader';

const params = parse(window.location.search) as {
  [OFFICE_JS_URL_QUERY_PARAMETER_KEY]: string;
};
const officeJsUrlToLoad =
  (params[OFFICE_JS_URL_QUERY_PARAMETER_KEY] || '').trim().length > 0
    ? params[OFFICE_JS_URL_QUERY_PARAMETER_KEY]
    : SCRIPT_URLS.OFFICE_JS_FOR_EDITOR;
addScriptTag(officeJsUrlToLoad, () => true /*isDoneCheck*/);
