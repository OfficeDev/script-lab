import { PATHS } from '../../src/constants';
import { SCRIPT_URLS } from '../../../common/src/constants';
import { addScriptTag } from '../../../common/src/utilities/script.loader';

let currentFinishedScriptCounter = 0;
const listOfScriptsToLoad = determineScriptsToDynamicallyLoad();
listOfScriptsToLoad.forEach(url =>
  addScriptTag(url, () => {
    currentFinishedScriptCounter++;
    return currentFinishedScriptCounter === listOfScriptsToLoad.length;
  }),
);

// Helpers

function determineScriptsToDynamicallyLoad(): string[] {
  if (window.location.hash === '#' + PATHS.CUSTOM_FUNCTIONS) {
    return [SCRIPT_URLS.OFFICE_JS_FOR_CUSTOM_FUNCTIONS_DASHBOARD];
  } else {
    return [SCRIPT_URLS.OFFICE_JS_FOR_EDITOR, SCRIPT_URLS.MONACO_LOADER];
  }
}
