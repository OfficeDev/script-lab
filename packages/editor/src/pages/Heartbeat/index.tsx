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
import { getPythonConfigIfAny } from '../../utils/python';
import { JupyterNotebook } from 'common/lib/utilities/Jupyter';
const logger = log.getLogger('heartbeat');

const Heartbeat = () => {
  useEffect(() => {
    window.onmessage = onMessage;
    return () => (window.onmessage = null);
  });
  return null;
};

export default Heartbeat;

async function onMessage(event: { data: string; origin: string }) {
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
    sendMessageBackToRunner(
      event.origin,
      EDITOR_HEARTBEAT_TO_RUNNER_RESPONSES.PASS_MESSAGE_TO_USER_SNIPPET,
      strictType<IEditorHeartbeatToRunnerResponse>({
        type: RUNNER_TO_EDITOR_HEARTBEAT_REQUESTS.IS_JUPYTER_ENABLED,
        contents: getPythonConfigIfAny() ? true : false,
      }),
    );
  } else if (
    event.data.indexOf(RUNNER_TO_EDITOR_HEARTBEAT_REQUESTS.EXECUTE_JUPYTER_SCRIPT) === 0
  ) {
    // Message will come in as "EXECUTE_JUPYTER_SCRIPT:<base64string>".
    // So just isolate the base64 portion:
    const base64 = event.data.substr(
      RUNNER_TO_EDITOR_HEARTBEAT_REQUESTS.EXECUTE_JUPYTER_SCRIPT.length + 1,
    );
    const code = atob(base64);
    try {
      const config = getPythonConfigIfAny();
      debugger;
      const notebook = new JupyterNotebook(
        { baseUrl: config.url, token: config.token },
        config.notebook,
      );
      await notebook.executeCode(code);
      debugger;
    } catch (e) {
      debugger; // FIXME
      console.log('Error!!!');
    }
  }
}

function sendMessageBackToRunner(origin: string, type: string, payload: any) {
  logger.info(`Heartbeat sending ${type} message back`);
  window.parent.postMessage(
    strictType<IEditorHeartbeatToRunnerResponse>({ type: type, contents: payload }),
    origin,
  );
}
