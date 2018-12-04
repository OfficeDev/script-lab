import { WINDOW_SCRIPT_LAB_NAVIGATING_AWAY_TO_DIFFERENT_ENVIRONMENT_KEY } from 'common/lib/utilities/script-loader/constants';

(() => {
  // If will be navigating away in a moment, just quit and wait for that redirect to run its course
  if ((window as any)[WINDOW_SCRIPT_LAB_NAVIGATING_AWAY_TO_DIFFERENT_ENVIRONMENT_KEY]) {
    return;
  }

  window.location.replace('/#/custom-functions');
})();
