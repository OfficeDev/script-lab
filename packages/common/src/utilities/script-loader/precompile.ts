// A file that contains loading logic TO BE USED BY THE PRECOMPILE SCRIPTS
// Note that such scripts do not have access to Promises.  And even if they did,
// they are loaded in a separate script tag, and so returning a Promise would
// still be meaningless.  As such, they communicate via setting a flag
// on the window object, to signify that Script Lab has loaded.

import {
  WINDOW_SCRIPT_LAB_IS_READY_KEY,
  WINDOW_SCRIPT_LAB_NAVIGATING_AWAY_TO_DIFFERENT_ENVIRONMENT_KEY,
} from './constants';

export function addScriptTags(urls: string[]) {
  // If will be navigating away in a moment, don't bother.
  // This will also ensure that WINDOW_SCRIPT_LAB_IS_READY_KEY never gets set,
  // and so any consumer listening to that (via waitForAllDynamicScriptsToBeLoaded)
  // will just keep the loading UI as is.
  if ((window as any)[WINDOW_SCRIPT_LAB_NAVIGATING_AWAY_TO_DIFFERENT_ENVIRONMENT_KEY]) {
    return;
  }

  let currentFinishedScriptCounter = 0;
  urls.forEach(url =>
    addScriptTag(url, () => {
      currentFinishedScriptCounter++;
      return currentFinishedScriptCounter === urls.length;
    }),
  );
}

function addScriptTag(url: string, isDoneCheck: () => boolean) {
  const allScriptElements = document.getElementsByTagName('script');
  const thisScriptElement = allScriptElements[allScriptElements.length - 1];
  const scriptElement = document.createElement('script');
  scriptElement.setAttribute('src', url);
  scriptElement.onload = () => {
    console.log(`Dynamically loaded ${url}`);
    if (isDoneCheck()) {
      console.log(
        `All dynamic scripts are loaded, setting flag to proceed with Script Lab initialization`,
      );
      (window as any)[WINDOW_SCRIPT_LAB_IS_READY_KEY] = true;
    }
  };
  thisScriptElement.parentNode!.insertBefore(
    scriptElement,
    thisScriptElement.nextSibling /* if null, will just insert at end, which is OK too */,
  );
}
