import { PATHS, SCRIPT_URLS } from '../../src/constants';

determineScriptsToDynamicallyLoad().forEach(url => addScriptTag(url));

// Helpers

function determineScriptsToDynamicallyLoad(): string[] {
  if (window.location.hash.substr(0, 2) === '#' + PATHS.CUSTOM_FUNCTIONS) {
    return [SCRIPT_URLS.OFFICE_JS_FOR_CUSTOM_FUNCTIONS_DASHBOARD];
  } else {
    return [SCRIPT_URLS.MONACO_LOADER, SCRIPT_URLS.OFFICE_JS_FOR_EDITOR];
  }
}

function addScriptTag(url: string) {
  const allScriptElements = document.getElementsByTagName('script');
  const thisScriptElement = allScriptElements[allScriptElements.length - 1];
  const scriptElement = document.createElement('script');
  scriptElement.setAttribute('src', url);
  thisScriptElement.parentNode!.insertBefore(
    scriptElement,
    thisScriptElement.nextSibling /* if null, will just insert at end, which is OK too */,
  );
}
