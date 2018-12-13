import React, { useEffect } from 'react';
import { currentRunnerUrl } from 'common/lib/environment';
import ensureFreshLocalStorage from 'common/lib/utilities/ensure.fresh.local.storage';

const Heartbeat = () => {
  useEffect(() => {
    window.onmessage = onMessage;
    return () => (window.onmessage = null);
  });
  return null;
};

export default Heartbeat;

function onMessage(event) {
  console.log({ event });
  if (event.origin !== currentRunnerUrl) {
    console.error(`Could not read snippet data: invalid origin "${event.origin}"`);
    return;
  }

  ensureFreshLocalStorage();

  if (event.data.indexOf('GET_ACTIVE_SOLUTION') === 0) {
    const host = event.data.split('/')[1];
    const solution = localStorage.getItem('activeSolution_' + host);
    console.log('posting back to parent');
    console.log(solution);
    window.parent.postMessage(solution, event.origin);
  }
}
