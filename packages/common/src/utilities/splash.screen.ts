import { stringifyPlusPlus } from './string';
import { ScriptLabError } from './error';
import { DEBUG_KEY } from './localStorage';

// Keep the state for whether or not currently showing an error --
//   that way, even if get a request to dismiss the splash screen,
//   don't do it if an error is currently showing
//   (fixes https://github.com/OfficeDev/script-lab/issues/527)
let isCurrentlyShowingError = false;

/** A global error handler. Returns a boolean (always "true") to indicate that
 * the error has been handled, and to prevent firing the default event handler.
 */
export function invokeGlobalErrorHandler(
  error: any,
  options?: { showExpanded: boolean },
): true {
  if (isMonacoError(error)) {
    // Monaco errors sometimes occur, but don't really mean much, and aren't something we can control.
    // So just ignore them.
    return;
  }

  if (window.localStorage.getItem(DEBUG_KEY)) {
    // tslint:disable-next-line:no-debugger
    debugger;
  }

  if (isCurrentlyShowingError) {
    // If already showing an error, don't show the subsequent one, since the first one
    // in the chain is likely the more important one.
    console.error('Global error handler -- FOLLOW-UP ERROR (not showing in the UI)');
    console.error(error);
    return true;
  }

  console.error('Global error handler:');
  console.error(error);

  const loadingElement = document.getElementById('loading')!;
  const rootElement = document.getElementById('root');

  const subtitleElement = document.querySelectorAll('#loading h2')[0] as HTMLElement;

  const fromOldErrorIfAny = document.querySelectorAll('#loading .error');
  // Don't use "forEach", it doesn't work in IE!  Instead, just iterate over the elements:
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < fromOldErrorIfAny.length; i++) {
    const item = fromOldErrorIfAny[i];
    item.parentNode!.removeChild(item);
  }

  subtitleElement.innerHTML =
    error instanceof ScriptLabError ? error.message : 'An unexpected error has occurred.';

  const moreDetailsError = error instanceof ScriptLabError ? error.innerError : error;
  let clickForMoreInfoElement: HTMLAnchorElement;
  if (moreDetailsError) {
    clickForMoreInfoElement = document.createElement('a');
    clickForMoreInfoElement.href = '#';
    clickForMoreInfoElement.className = 'ms-font-m error';
    clickForMoreInfoElement.textContent = 'Click for more info';
    clickForMoreInfoElement.addEventListener('click', event => {
      const errorMessageElement = document.createElement('pre');
      errorMessageElement.textContent = stringifyPlusPlus(moreDetailsError);
      loadingElement.insertBefore(errorMessageElement, clickForMoreInfoElement);
      clickForMoreInfoElement!.parentNode!.removeChild(clickForMoreInfoElement);
      event.preventDefault(); // So that doesn't try to navigate to "#"
    });
    loadingElement.insertBefore(clickForMoreInfoElement, null);
  }

  const hideCloseButton =
    error instanceof ScriptLabError && error.options.hideCloseButton;
  if (!hideCloseButton) {
    const closeElement = document.createElement('a');
    closeElement.href = '#';
    closeElement.className = 'ms-font-m error';
    closeElement.textContent = 'Close';
    closeElement.addEventListener('click', event => {
      loadingElement.style.visibility = 'hidden';
      rootElement!.style.display = '';
      isCurrentlyShowingError = false;
      event.preventDefault(); // So that doesn't try to navigate to "#"
    });
    loadingElement.insertBefore(closeElement, null);
  }

  // If this is (somehow) the second time that the event handler is ignored, do some cleanup
  const previousErrorMessageElement: HTMLElement = document.querySelectorAll(
    '#loading pre',
  )[0] as HTMLElement;
  if (previousErrorMessageElement) {
    loadingElement.removeChild(previousErrorMessageElement);
  }

  // Remove the loading dots (surrounding with if-statement safety check in case this is invoked twice)
  const loadingDotsElement = document.querySelectorAll(
    '#loading .loading-indicator',
  )[0] as HTMLElement;
  if (loadingDotsElement) {
    loadingDotsElement.parentNode!.removeChild(loadingDotsElement);
  }

  rootElement!.style.display = 'none';
  loadingElement.style.visibility = '';
  isCurrentlyShowingError = true;

  if (options && options.showExpanded) {
    if (clickForMoreInfoElement) {
      clickForMoreInfoElement.click();
    }
  }

  return true;
}

export function showSplashScreen(subtitle: string, onClick?: () => void) {
  const loadingIndicator = document.getElementById('loading')!;
  loadingIndicator.style.visibility = '';

  const subtitleElement = replaceSubtitleElement();
  subtitleElement.textContent = subtitle;

  if (onClick) {
    subtitleElement.addEventListener('click', _ => {
      // Replace it, so that the click handler is now gone
      replaceSubtitleElement();
      // And now fire the callback:
      onClick();
    });
  }

  (document.getElementById('root') as HTMLElement).style.display = 'none';

  /////////////////////////////////////
  // Helper:
  function replaceSubtitleElement(): HTMLElement {
    const previousSubtitleElement = document.querySelectorAll(
      '#loading h2',
    )[0] as HTMLElement;
    const clone = previousSubtitleElement.cloneNode(true);
    previousSubtitleElement.parentNode.replaceChild(clone, previousSubtitleElement);
    return clone as HTMLElement;
  }
}

export function hideSplashScreen() {
  // If currently showing an error, ignore the request to hide the splash screen
  if (isCurrentlyShowingError) {
    return;
  }

  const loadingIndicator = document.getElementById('loading')!;
  loadingIndicator.style.visibility = 'hidden';

  const rootElement = document.getElementById('root') as HTMLElement;
  if (rootElement) {
    rootElement.style.display = '';
  }
}

function isMonacoError(error: any): boolean {
  // some errors show up as Error objects with a message,
  // while others are thrown as strings
  let stringToTest = '';
  if (error.message) {
    stringToTest = error.message;
  } else {
    stringToTest = error.toString();
  }
  return stringToTest.includes('monaco-editor');
}
