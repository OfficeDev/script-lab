import {
  SCRIPT_URLS,
  OFFICE_JS_URL_QUERY_PARAMETER_KEY,
} from '../../../common/src/constants';
import { addScriptTag, extractParams } from '../../../common/src/utilities/script.loader';

const params = extractParams(window.location.href.split('?')[1]) || {};
const officeJsUrlToLoad =
  ((params[OFFICE_JS_URL_QUERY_PARAMETER_KEY] as string) || '').trim().length > 0
    ? params[OFFICE_JS_URL_QUERY_PARAMETER_KEY]
    : SCRIPT_URLS.OFFICE_JS_FOR_EDITOR;
addScriptTag(officeJsUrlToLoad, () => true /*isDoneCheck*/);
