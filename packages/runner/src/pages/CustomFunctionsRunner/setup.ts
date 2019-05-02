import { officeNamespacesForCustomFunctionsIframe } from '../../constants';
import { currentEditorUrl } from 'common/lib/environment';
import { generateLogString, stringifyPlusPlus } from 'common/lib/utilities/string';
import { JupyterNotebook } from 'common/lib/utilities/Jupyter';

import generateCustomFunctionIframe from './run.customFunctions';
import { initializeJupyter } from './jupyterRunner';

const HEARTBEAT_URL = `${currentEditorUrl}/custom-functions-heartbeat.html`;
const VERBOSE_MODE = false;

export default () => {
  window.document.title = 'Script Lab - Custom Functions runner';

  const ScriptLabCustomFunctionsDictionary = {};
  (window as any).ScriptLabCustomFunctionsDictionary = ScriptLabCustomFunctionsDictionary;

  // set up heartbeat listener
  window.onmessage = async ({ origin, data }) => {
    if (origin !== currentEditorUrl) {
      // console.error(`Unexpected message from ${origin}: ${data}`);
      return;
    }

    const { type, payload }: ICustomFunctionsHeartbeatMessage = JSON.parse(data);
    switch (type) {
      case 'metadata': {
        const initialPayload = payload as ICustomFunctionsIframeRunnerOnLoadPayload;
        if (initialPayload.pythonConfig) {
          initializeJupyter(initialPayload.pythonConfig);
          // TODO: (with Shaofeng) temporary hack, will definitely need to be removed once it's not either/or
          delete (window as any).CustomFunctionMappings.__delay__;
        } else {
          // TODO: (with Shaofeng) for now, it's an either/or
          await initializeRunnableSnippets(initialPayload);
          for (const key in ScriptLabCustomFunctionsDictionary) {
            CustomFunctions.associate(key, ScriptLabCustomFunctionsDictionary[key]);
          }
        }
        break;
      }
      case 'refresh':
        window.location.reload();
        break;
      default:
        throw new Error(`Unexpected event type: ${type}`);
    }
  };

  addHeartbeat();
  overwriteConsole('[SYSTEM]', window);

  logIfExtraLoggingEnabled('Done preparing snippets');

  logIfExtraLoggingEnabled(
    'Custom functions runner is ready to evaluate your functions!',
  );
};
///////////////////////////////////////

let heartbeat: HTMLIFrameElement;
function addHeartbeat() {
  heartbeat = document.createElement('iframe');
  heartbeat.style.display = 'none';
  heartbeat.src = HEARTBEAT_URL;
  document.body.appendChild(heartbeat);
}

async function initializeRunnableSnippets(
  fullPayload: ICustomFunctionsIframeRunnerOnLoadPayload,
) {
  return new Promise(resolve =>
    tryCatch(() => {
      let successfulRegistrationsCount = 0;

      (window as any).scriptRunnerOnLoad = (contentWindow: Window, id: string) =>
        tryCatch(() => {
          const snippetMetadata = fullPayload.typescriptMetadata.find(
            item => item.solutionId === id,
          )!;
          overwriteConsole(snippetMetadata.namespace, contentWindow);
          contentWindow.onerror = (...args) => console.error(args);

          logIfExtraLoggingEnabled(
            `Snippet for namespace "${snippetMetadata.namespace}" beginning to load.`,
          );

          officeNamespacesForCustomFunctionsIframe.forEach(namespace => {
            (contentWindow as any)[namespace] = (window as any)[namespace];
          });
        });

      (window as any).scriptRunnerOnLoadComplete = () => {
        if (++successfulRegistrationsCount === fullPayload.typescriptMetadata.length) {
          resolve();
        }
      };

      fullPayload.typescriptMetadata.forEach(customFuncData => {
        const iframe = document.createElement('iframe');
        iframe.src = 'about:blank';
        document.head.insertBefore(iframe, null);

        const contentWindow = iframe.contentWindow!;

        // Write to the iframe (and note that must do the ".write" call first,
        // before setting any window properties). Setting console and onerror here
        // (for any initial logging or error handling from snippet-referenced libraries),
        // but for extra safety also setting them inside of scriptRunnerOnLoad.
        contentWindow.document.open();
        contentWindow.document.write(generateCustomFunctionIframe(customFuncData));
        (contentWindow as any).console = window.console;
        contentWindow.onerror = (...args) => {
          handleError({ error: args });
        };
        contentWindow.document.close();
      });
    }),
  );
}

function logIfExtraLoggingEnabled(message: string) {
  if (VERBOSE_MODE) {
    tryToSendLog({
      message: message,
      severity: 'info',
      source: '[SYSTEM]',
    });
  }
}

function overwriteConsole(source: '[SYSTEM]' | string, windowObject: Window) {
  const logTypes: ConsoleLogTypes[] = ['log', 'info', 'warn', 'error'];
  logTypes.forEach(
    methodName =>
      ((windowObject.console as any)[methodName] = consoleMsgTypeImplementation(
        methodName,
      )),
  );

  function consoleMsgTypeImplementation(severityType: ConsoleLogTypes) {
    return (...args: any[]) => {
      const { severity, message } = generateLogString(args, severityType);

      tryToSendLog({
        source,
        severity,
        message,
      });
    };
  }
}

let logCounter = 0;
function tryToSendLog(data: { source: string; severity: string; message: string }) {
  try {
    if (heartbeat && heartbeat.contentWindow) {
      heartbeat.contentWindow.postMessage(
        JSON.stringify({
          type: 'log',
          payload: {
            id: logCounter++,
            message: data.message,
            severity: data.severity,
          },
        }),
        HEARTBEAT_URL,
      );
    }
  } catch (e) {
    // If couldn't log, not much you can do about it.
  }
}

async function tryCatch(func: () => any) {
  try {
    await func();
  } catch (e) {
    handleError(e);
  }
}

function handleError(error: Error | any) {
  tryToSendLog({
    message: stringifyPlusPlus(error),
    severity: 'error',
    source: '[SYSTEM]',
  });
}
