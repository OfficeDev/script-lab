import queryString from 'query-string';
import { localStorageKeys, SERVER_HELLO_ENDPOINT } from '../constants';
import { editorUrls, serverUrls, currentEditorUrl } from '../environment';
import { pause } from './misc';
import ensureFreshLocalStorage from './ensure.fresh.local.storage';
import { showSplashScreen, hideSplashScreen } from './splash.screen';

/** Checks (and redirects) if needs to go to a different environment.
 * Returns `true` if will be redirecting away
 */
export async function redirectIfNeeded(): Promise<boolean> {
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

      const keepGoingWithRedirect = await considerIfReallyWantToRedirect(redirectUrl);
      if (!keepGoingWithRedirect) {
        return false;
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

async function considerIfReallyWantToRedirect(redirectUrl: string): Promise<boolean> {
  // When redirecting to localhost (dev scenario), it's very common that localhost
  //   might not be running, and suddenly you're in a broken state and can't even
  //   load the production add-in/site.
  // As such, if will be redirecting to localhost, first check that localhost is running.
  // We will use the server to test, because the localhost server is running on "http" rather than "https",
  //   and thus won't run into certificate issues (by contrast, IE won't render an iframe that
  //   doesn't have a trusted cert).
  if (redirectUrl.startsWith('https://localhost')) {
    let manuallyCancelled: boolean = false;

    const resultOfWaiting = await new Promise<boolean>(async resolve => {
      const AMOUNT_OF_TIME_TO_WAIT_ON_LOCALHOST = 10000; /* Enough to let the developer notice */

      const timeout = setTimeout(() => {
        resolve(false);
      }, AMOUNT_OF_TIME_TO_WAIT_ON_LOCALHOST);

      showSplashScreen(
        `Attempting to redirect to "${redirectUrl}"... Click to cancel.`,
        () => {
          manuallyCancelled = true;
          clearTimeout(timeout);
          resolve(false);
        },
      );

      try {
        const targetServer = serverUrls[getConfigName(redirectUrl)];
        if (targetServer === null) {
          throw new Error(
            `Could not find server config for redirect URL "${redirectUrl}"`,
          );
        }

        const response = await (await fetch(
          `${targetServer}/${SERVER_HELLO_ENDPOINT.path}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )).json();

        clearTimeout(timeout);
        resolve(
          JSON.stringify(response).includes(
            JSON.stringify(SERVER_HELLO_ENDPOINT.payload),
          ),
        );
      } catch (e) {
        console.error(e);
        clearTimeout(timeout);
        resolve(false);
      }
    });

    if (resultOfWaiting) {
      showSplashScreen(`Success! "${redirectUrl}" site is up and running!`);
      return true;
    } else {
      showSplashScreen(
        `"${redirectUrl}" is not responding. Staying on ${window.location.origin}`,
      );
      window.localStorage.removeItem(localStorageKeys.editor.redirectEnvironmentUrl);

      if (!manuallyCancelled) {
        // Give the developer a few seconds to absorb this bit of info
        await pause(3000);
      }

      hideSplashScreen();
      return false;
    }
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

function getConfigName(url: string): string | null {
  for (const key in editorUrls) {
    const value = (editorUrls as any)[key];
    if (value.indexOf(url) === 0) {
      return key;
    }
  }

  return null;
}
