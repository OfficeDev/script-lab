import { PATHS } from '../../src/constants';
import { SCRIPT_URLS } from '../../../common/src/constants';
import { addScriptTags } from '../../../common/src/utilities/script-loader/precompile';

addScriptTags(determineScriptsToDynamicallyLoad());

/////////////////////////////////////////////

// Helpers

function determineScriptsToDynamicallyLoad(): string[] {
  if (window.location.hash === '#' + PATHS.CUSTOM_FUNCTIONS) {
    return [SCRIPT_URLS.OFFICE_JS_FOR_CUSTOM_FUNCTIONS_DASHBOARD];
  } else {
    return [SCRIPT_URLS.OFFICE_JS_FOR_EDITOR, SCRIPT_URLS.MONACO_LOADER];
  }
}
