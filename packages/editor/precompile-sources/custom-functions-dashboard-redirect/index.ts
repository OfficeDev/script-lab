import { WINDOW_SCRIPT_LAB_NAVIGATING_AWAY_TO_DIFFERENT_ENVIRONMENT_KEY } from 'common/lib/utilities/script-loader/constants';
import { parse } from 'query-string';

(() => {
  // If will be navigating away in a moment, just quit and wait for that redirect to run its course
  if ((window as any)[WINDOW_SCRIPT_LAB_NAVIGATING_AWAY_TO_DIFFERENT_ENVIRONMENT_KEY]) {
    return;
  }
  const backButtonParamName = 'backButton';

  // Note: we're stripping out the entitlement token only allowing the backButton query param to be passed through
  const hasBackButton = !!parse(window.location.search)[backButtonParamName];

  window.location.replace(
    `/#/custom-functions${hasBackButton ? `?${backButtonParamName}=true` : ''}`,
  );
})();
