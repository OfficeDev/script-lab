import { useEffect } from 'react';
import { currentRunnerUrl } from 'common/lib/environment';
import ensureFreshLocalStorage from 'common/lib/utilities/ensure.fresh.local.storage';

import * as log from 'common/lib/utilities/log';
const logger = log.getLogger('heartbeat');

const Heartbeat = () => {
  useEffect(() => {
    window.onmessage = onMessage;
    return () => (window.onmessage = null);
  });
  return null;
};

export default Heartbeat;

function onMessage(event) {
  logger.info(event);
  if (event.origin !== currentRunnerUrl) {
    console.error(`Could not read snippet data: invalid origin "${event.origin}"`);
    return;
  }

  ensureFreshLocalStorage();

  if (event.data.indexOf('GET_ACTIVE_SOLUTION') === 0) {
    const host = event.data.split('/')[1];
    const solution = localStorage.getItem('activeSolution_' + host);

    logger.info('GET_ACTIVE_SOLUTION received, posting back to parent');
    window.parent.postMessage(solution, event.origin);
  }
}
