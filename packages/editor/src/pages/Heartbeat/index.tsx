import { useEffect } from 'react';
import { currentRunnerUrl } from 'common/lib/environment';
import ensureFreshLocalStorage from 'common/lib/utilities/ensure.fresh.local.storage';

import * as log from 'common/lib/utilities/log';
import {
  RUNNER_TO_EDITOR_HEARTBEAT_REQUESTS,
  EDITOR_HEARTBEAT_TO_RUNNER_RESPONSES,
  IEditorHeartbeatToRunnerResponse,
} from 'common/lib/constants';
import { strictType } from 'common/lib/utilities/misc';
const logger = log.getLogger('heartbeat');

const Heartbeat = () => {
  useEffect(() => {
    window.onmessage = onMessage;
    return () => (window.onmessage = null);
  });
  return null;
};

export default Heartbeat;

function onMessage(event: { data: string; origin: string }) {
  logger.info(event);
  if (event.origin !== currentRunnerUrl) {
    console.error(`Could not read snippet data: invalid origin "${event.origin}"`);
    return;
  }

  ensureFreshLocalStorage();

  if (event.data.indexOf(RUNNER_TO_EDITOR_HEARTBEAT_REQUESTS.GET_ACTIVE_SOLUTION) === 0) {
    const host = event.data.split('/')[1];
    const solution = localStorage.getItem('activeSolution_' + host);
    sendMessageBackToRunner(
      event.origin,
      EDITOR_HEARTBEAT_TO_RUNNER_RESPONSES.ACTIVE_SOLUTION,
      solution,
    );
  } else if (
    event.data.indexOf(RUNNER_TO_EDITOR_HEARTBEAT_REQUESTS.IS_JUPYTER_ENABLED) === 0
  ) {
    debugger; // FIXME
  }
}

function sendMessageBackToRunner(origin: string, type: string, payload: any) {
  logger.info(`Heartbeat sending ${type} message back`);
  window.parent.postMessage(
    strictType<IEditorHeartbeatToRunnerResponse>({ type: type, contents: payload }),
    origin,
  );
}
