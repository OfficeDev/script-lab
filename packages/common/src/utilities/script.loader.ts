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
