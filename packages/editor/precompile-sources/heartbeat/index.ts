import { getCurrentEnv, reactRunnerUrls } from '../../src/environment';

window.onmessage = event => {
  if (event.origin !== reactRunnerUrls[getCurrentEnv()]) {
    console.error(`Could not read snippet data: invalid origin "${event.origin}"`);
  }

  // In order to fix the IE cross-tab issue (#147)
  localStorage.setItem('playground_dummy_key', 'null');

  if (event.data.indexOf('GET_ACTIVE_SOLUTION') >= 0) {
    const host = event.data.split('/')[1];
    const solution = localStorage.getItem('activeSolution_' + host);
    window.parent.postMessage(solution, event.origin);
  }
};
