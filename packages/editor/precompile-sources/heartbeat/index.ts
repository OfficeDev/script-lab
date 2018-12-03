import { getCurrentEnv, reactRunnerUrls } from '../../src/environment';
import ensureFreshLocalStorage from '../../../common/lib/utilities/ensure.fresh.local.storage';

window.onmessage = event => {
  if (event.origin !== reactRunnerUrls[getCurrentEnv()]) {
    console.error(`Could not read snippet data: invalid origin "${event.origin}"`);
    return;
  }

  ensureFreshLocalStorage();

  if (event.data.indexOf('GET_ACTIVE_SOLUTION') >= 0) {
    const host = event.data.split('/')[1];
    const solution = localStorage.getItem('activeSolution_' + host);
    window.parent.postMessage(solution, event.origin);
  }
};
