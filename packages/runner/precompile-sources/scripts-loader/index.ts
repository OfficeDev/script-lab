import { SCRIPT_URLS } from '../../../common/src/constants';
import { addScriptTag, extractParams } from '../../../common/src/utilities/script.loader';

const params = extractParams(window.location.href.split('?')[1]) || {};
const officeJsUrlToLoad =
  ((params['officejs'] as string) || '').trim().length > 0
    ? params['officejs']
    : SCRIPT_URLS.OFFICE_JS_FOR_EDITOR;
addScriptTag(officeJsUrlToLoad, () => true /*isDoneCheck*/);
