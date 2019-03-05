import queryString from 'query-string';
import { localStorageKeys } from '../constants';
import { editorUrls, currentEditorUrl } from '../environment';
import ensureFreshLocalStorage from './ensure.fresh.local.storage';
import { showSplashScreen } from './splash.screen';

/** Time threshold for kicking in a "click to cancel" UI on redirects */
const AMOUNT_OF_TIME_BETWEEN_SUSPICIOUS_LOCALHOST_REDIRECTS = 20000;

/** Amount of time to wait for the user to click to cancel, before redirecting anyway */
const AMOUNT_OF_TIME_TO_WAIT_ON_CLICK_TO_CANCEL = 4000;

/** Checks (and redirects) if needs to go to a different environment.
 * @param isMainDomain - should be set to true if this is called for
 *    the main domain (e.g., editor domain for Script Lab, rather than the runner).
 *    Put differently, the main domain is the domain that hosts the
 *    dropdown for switching to other environments.
 * @returns `true` if will be redirecting away
 */
export async function redirectIfNeeded({
  isMainDomain,
}: {
  isMainDomain: boolean;
}): Promise<boolean> {
  try {
    const params = queryString.parse(window.location.search) as {
      originEnvironment?: string;
      targetEnvironment?: string;
    };

    const originUrl = (params.originEnvironment || '').trim();
    const targetUrl = (params.targetEnvironment || '').trim();

    const urlsAreOk = isAllowedUrl(originUrl) && isAllowedUrl(targetUrl);
    if (!urlsAreOk) {
      throw new Error('Invalid query parameters for target or origin environments');
    }

    // If there is a target environment specified, set it in local storage
    if (targetUrl.length > 0) {
      // The exception: clear the redirect key if already on the target (i.e.,
      // the user has returned back to the root site)
      if (window.location.href.toLowerCase().indexOf(targetUrl) === 0) {
        window.localStorage.removeItem(localStorageKeys.editor.redirectEnvironmentUrl);
        return false;
      }

      // If hasn't quit above, then set the redirect URL into storage
      window.localStorage.setItem(
        localStorageKeys.editor.redirectEnvironmentUrl,
        targetUrl,
      );

      // Also make sure that if redirecting to localStorage, remember this
      // and offer this option from prod again in the future (without forcing
      // always going through alpha first)
      if (targetUrl === editorUrls.local) {
        window.localStorage.setItem(
          localStorageKeys.editor.shouldShowLocalhostRedirectOption,
          '1',
        );
      }
    }

    // Store the root site origin, if provided
    if (originUrl.length > 0) {
      window.localStorage.setItem(
        localStorageKeys.editor.originEnvironmentUrl,
        decodeURIComponent(originUrl).toLowerCase(),
      );
    }

    ensureFreshLocalStorage();
    const redirectUrl = window.localStorage.getItem(
      localStorageKeys.editor.redirectEnvironmentUrl,
    );

    if (redirectUrl) {
      const newQueryParams = queryString.parse(window.location.search) as {
        originEnvironment: string;
      } & {
        [key: string]: string;
      };
      newQueryParams.originEnvironment = window.location.origin;

      const keepGoingWithRedirect = await considerIfReallyWantToRedirect({
        redirectUrl,
        isMainDomain,
      });
      if (!keepGoingWithRedirect) {
        return false;
      }

      if (isMainDomain) {
        window.localStorage.setItem(
          localStorageKeys.editor.lastEnvironmentRedirectTimestamp,
          Date.now().toString(),
        );
      }

      const finalUrlComponents: string[] = [
        redirectUrl,
        window.location.pathname,
        Object.keys(newQueryParams).length > 0
          ? '?' + queryString.stringify(newQueryParams)
          : '',
        window.location.hash,
      ];
      window.location.replace(finalUrlComponents.join(''));

      return true;
    }

    // If reached here, environment is already configured. No need to redirect anywhere.
    return false;
  } catch (e) {
    console.error('Error redirecting the environments, staying on current page', e);
  }

  return false;
}

export async function redirectEditorToOtherEnvironment(configName: string) {
  const targetEnvironment = editorUrls[configName];

  ensureFreshLocalStorage();
  const originEnvironment = window.localStorage.getItem(
    localStorageKeys.editor.originEnvironmentUrl,
  );

  showSplashScreen('Re-loading Script Lab...');

  // Add query string parameters to default editor URL
  if (originEnvironment) {
    window.location.href = `${originEnvironment}?targetEnvironment=${encodeURIComponent(
      targetEnvironment,
    )}`;
  } else {
    window.localStorage.setItem(
      localStorageKeys.editor.redirectEnvironmentUrl,
      targetEnvironment,
    );
    window.location.href = `${targetEnvironment}?originEnvironment=${encodeURIComponent(
      currentEditorUrl,
    )}`;
  }
}

///////////////////////////////////////

async function considerIfReallyWantToRedirect({
  isMainDomain,
  redirectUrl,
}: {
  isMainDomain: boolean;
  redirectUrl: string;
}): Promise<boolean> {
  // When redirecting to localhost (dev scenario), sometimes localhost
  //   might not be running, and suddenly you're in a broken state and can't even
  //   load the production add-in/site.
  // To work around it, if on main domain and redirecting to localhost,
  //   check whether recently failed. If failed, give the user a few seconds
  //   to decide if want to try again, versus to cancel the redirect.
  if (isMainDomain && redirectUrl.startsWith('https://localhost')) {
    if (checkIfLastRedirectWasRecent()) {
      const keepGoing = await new Promise<boolean>(async resolve => {
        const timeout = setTimeout(() => {
          resolve(true); // If haven't clicked cancel yet, resolve to true
        }, AMOUNT_OF_TIME_TO_WAIT_ON_CLICK_TO_CANCEL);

        showSplashScreen(
          `Redirecting to "${redirectUrl}" in a few seconds. Click now to cancel.`,
          () => {
            clearTimeout(timeout);
            window.localStorage.removeItem(
              localStorageKeys.editor.redirectEnvironmentUrl,
            );
            resolve(false);
          },
        );
      });

      if (!keepGoing) {
        return false;
      }
    }

    // For localhost, make it obvious that's redirecting:
    showSplashScreen(`Redirecting to "${redirectUrl}"`);
  }

  return true;
}

function isAllowedUrl(url: string) {
  if (url.length === 0) {
    return true;
  }

  for (const key in editorUrls) {
    const value = (editorUrls as any)[key];
    if (value.indexOf(url) === 0) {
      return true;
    }
  }

  return false;
}

function checkIfLastRedirectWasRecent(): boolean {
  const timeSinceLastRedirectAttempt = Number(
    window.localStorage.getItem(localStorageKeys.editor.lastEnvironmentRedirectTimestamp),
  );
  const diff = Date.now() - timeSinceLastRedirectAttempt;
  return diff < AMOUNT_OF_TIME_BETWEEN_SUSPICIOUS_LOCALHOST_REDIRECTS;
}
