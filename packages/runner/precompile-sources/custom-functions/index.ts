import { officeNamespacesForCustomFunctionsIframe } from '../../src/constants';
import { generateLogString, stringifyPlusPlus } from 'common/lib/utilities/string';
import 'core-js/fn/array/find';

import generateCustomFunctionIframe, {
  ICustomFunctionPayload,
} from './run.customFunctions';

const VERBOSE_MODE = true; // FIXME: Nico: you'll probably want to turn this off before going to production

(async () => {
  // FIXME: Start heartbeat and hook up refresh event.  Note, might not need refresh if reloading the taskpane (which calls "CustomFunctionsManager.register" destroys the old iframe)

  overwriteConsole('[SYSTEM]', window);

  const payload = getFakePayload();
  await initializeRunnableSnippets(payload);
  logIfExtraLoggingEnabled('Done preparing snippets');

  // tslint:disable-next-line:no-string-literal
  delete CustomFunctionMappings['__delay__'];

  logIfExtraLoggingEnabled(
    'Custom functions runner is ready to evaluate your functions!',
  );
})();
///////////////////////////////////////

async function initializeRunnableSnippets(payload: ICustomFunctionPayload[]) {
  return new Promise(resolve =>
    tryCatch(() => {
      let successfulRegistrationsCount = 0;

      (window as any).scriptRunnerOnLoad = (contentWindow: Window, id: string) =>
        tryCatch(() => {
          const snippetMetadata = payload.find(item => item.solutionId === id)!;
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
        if (++successfulRegistrationsCount === payload.length) {
          resolve();
        }
      };

      payload.forEach(customFuncData => {
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

function tryToSendLog(data: { source: string; severity: string; message: string }) {
  try {
    // FIXME: Nico: pass this to the heartbeat and also add a counter for the ID
    debugger;
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

// FIXME: Nico: replace with actual data that comes from heartbeat
function getFakePayload() {
  return [
    {
      solutionId: 'FooBar',
      namespace: 'FooBar',
      functionNames: ['foo', 'bar'],
      code:
        '/** @customFunction */\r\nfunction foo() {\r\n    return 42;\r\n}\r\n/** @customFunction */\r\nfunction bar() {\r\n    return 43;\r\n}\r\n',
      jsLibs: [
        'https://unpkg.com/core-js@2.4.1/client/core.min.js',
        'https://unpkg.com/@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js',
        'https://unpkg.com/jquery@3.1.1',
      ],
    },
    {
      solutionId: '2323423432',
      namespace: 'BlankSnippet',
      functionNames: ['add10', 'add5ish'],
      code:
        '/** @CustomFunction */\r\nfunction add10(x) {\r\n    return x + 10;\r\n}\r\n/** @CustomFunction */\r\nfunction add5ish(x) {\r\n    var num = Math.random();\r\n    console.log(num);\r\n    return x + num + 5;\r\n}\r\n',
      jsLibs: [
        'https://unpkg.com/core-js@2.4.1/client/core.min.js',
        'https://unpkg.com/@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js',
        'https://unpkg.com/jquery@3.1.1',
      ],
    },
  ];
}
