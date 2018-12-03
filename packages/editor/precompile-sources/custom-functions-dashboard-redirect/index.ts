import { parse } from 'query-string';
import { localStorageKeys } from '../../src/constants';
import { allEditorUrls } from '../../src/environment';
import ensureFreshLocalStorage from '../../../common/lib/utilities/ensure.fresh.local.storage';
import { addScriptTags } from '../../../common/src/utilities/script-loader/precompile';
import { WINDOW_SCRIPT_LAB_NAVIGATING_AWAY_TO_DIFFERENT_ENVIRONMENT_KEY } from '../../../common/src/utilities/script-loader/constants';

(() => {
  // If will be navigating away in a moment, just quit and wait for that redirect to run its course
  if ((window as any)[WINDOW_SCRIPT_LAB_NAVIGATING_AWAY_TO_DIFFERENT_ENVIRONMENT_KEY]) {
    return;
  }

  window.location.replace('/#/custom-functions');
})();
