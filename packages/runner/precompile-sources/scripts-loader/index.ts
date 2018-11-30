// import { PATHS, SCRIPT_URLS, WINDOW_SCRIPT_LAB_IS_READY_KEY } from '../../src/constants';

// let currentFinishedScriptCounter = 0;
// const listOfScriptsToLoad = determineScriptsToDynamicallyLoad();
// listOfScriptsToLoad.forEach(url => addScriptTag(url));

// // Helpers

// function determineScriptsToDynamicallyLoad(): string[] {
//   if (window.location.hash === '#' + PATHS.CUSTOM_FUNCTIONS) {
//     return [SCRIPT_URLS.OFFICE_JS_FOR_CUSTOM_FUNCTIONS_DASHBOARD];
//   } else {
//     return [SCRIPT_URLS.OFFICE_JS_FOR_EDITOR, SCRIPT_URLS.MONACO_LOADER];
//   }
// }

// function addScriptTag(url: string) {
//   const allScriptElements = document.getElementsByTagName('script');
//   const thisScriptElement = allScriptElements[allScriptElements.length - 1];
//   const scriptElement = document.createElement('script');
//   scriptElement.setAttribute('src', url);
//   scriptElement.onload = () => {
//     currentFinishedScriptCounter++;
//     console.log(`Dynamically loaded ${url}`);
//     if (currentFinishedScriptCounter === listOfScriptsToLoad.length) {
//       console.log(
//         `All dynamic scripts are loaded, setting flag to proceed with Script Lab initialization`,
//       );
//       (window as any)[WINDOW_SCRIPT_LAB_IS_READY_KEY] = true;
//     }
//   };
//   thisScriptElement.parentNode!.insertBefore(
//     scriptElement,
//     thisScriptElement.nextSibling /* if null, will just insert at end, which is OK too */,
//   );
// }
