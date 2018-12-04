import { parse } from 'query-string';
import { localStorageKeys } from '../../src/constants';
import { editorUrls } from 'common/lib/environment';
import ensureFreshLocalStorage from 'common/lib/utilities/ensure.fresh.local.storage';
import { WINDOW_SCRIPT_LAB_NAVIGATING_AWAY_TO_DIFFERENT_ENVIRONMENT_KEY } from 'common/lib/utilities/script-loader/constants';

(() => {
  try {
    const params = parse(window.location.search) as {
      originEnvironment?: string;
      targetEnvironment?: string;
    };

    const originUrl = (params.originEnvironment || '').trim();
    let targetUrl = (params.targetEnvironment || '').trim();

    const urlsAreOk = isAllowedUrl(originUrl) && isAllowedUrl(targetUrl);
    if (!urlsAreOk) {
      throw new Error('Invalid query parameters for target or origin environments');
    }

    // If there is a target environment specified, set it in local storage
    if (targetUrl.length > 0) {
      targetUrl = decodeURIComponent(targetUrl);

      // The exception: clear the redirect key if already on the target (i.e.,
      // the user has returned back to the root site)
      if (window.location.href.toLowerCase().indexOf(targetUrl) === 0) {
        window.localStorage.removeItem(localStorageKeys.redirectEnvironmentUrl);
        return;
      }

      // If hasn't quit above, then set the redirect URL into storage
      window.localStorage.setItem(localStorageKeys.redirectEnvironmentUrl, targetUrl);
    }

    // Store the root site origin, if provided
    if (originUrl.length > 0) {
      window.localStorage.setItem(
        localStorageKeys.originEnvironmentUrl,
        decodeURIComponent(originUrl).toLowerCase(),
      );
    }

    ensureFreshLocalStorage();
    const redirectUrl = window.localStorage.getItem(
      localStorageKeys.redirectEnvironmentUrl,
    );

    if (redirectUrl) {
      const originParam = [
        window.location.search ? '&' : '?',
        'originEnvironment=',
        encodeURIComponent(window.location.origin),
      ].join('');

      (window as any)[
        WINDOW_SCRIPT_LAB_NAVIGATING_AWAY_TO_DIFFERENT_ENVIRONMENT_KEY
      ] = true;

      window.location.replace(
        [
          redirectUrl,
          window.location.pathname,
          window.location.search,
          originParam,
          window.location.hash,
        ].join(''),
      );

      return;
    }

    // If reached here, environment is already configured.
    // Quit this script, and keep going with the other scripts just the way they normally would.
    return;
  } catch (e) {
    console.error('Error redirecting the environments, staying on current page', e);
  }
})();

///////////////////////////////////////

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
