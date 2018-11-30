import { WINDOW_SCRIPT_LAB_IS_READY_KEY } from '../constants';

export function addScriptTag(url: string, isDoneCheck: () => boolean) {
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

export function waitForAllDynamicScriptsToBeLoaded(): Promise<void> {
  if ((window as any)[WINDOW_SCRIPT_LAB_IS_READY_KEY]) {
    return Promise.resolve();
  }
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if ((window as any)[WINDOW_SCRIPT_LAB_IS_READY_KEY]) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

// Taken from office-js-helpers Authenticator class:
// https://github.com/OfficeDev/office-js-helpers/blob/master/src/authentication/authenticator.ts
export function extractParams(segment: string): any {
  if (segment == null || segment.trim() === '') {
    return null;
  }

  const params: any = {};
  const regex = /([^&=]+)=([^&]*)/g;
  let matchParts;

  // tslint:disable-next-line:no-conditional-assignment
  while ((matchParts = regex.exec(segment)) !== null) {
    // Fixes bugs when the state parameters contains a / before them
    if (matchParts[1] === '/state') {
      matchParts[1] = matchParts[1].replace('/', '');
    }
    params[decodeURIComponent(matchParts[1])] = decodeURIComponent(matchParts[2]);
  }

  return params;
}
