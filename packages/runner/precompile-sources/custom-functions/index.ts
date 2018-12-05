// tslint:disable-next-line:no-reference (needed for VS Code to be happy)
/// <reference path="../../../common/src/interfaces/logs.d.ts" />

import { generateLogString } from 'common/lib/utilities/string';

// tslint:disable-next-line:no-debugger
debugger;

function add10(n: number) {
  // tslint:disable-next-line:no-debugger
  debugger;
  return n + 10;
}
function add5ish(n: number) {
  // tslint:disable-next-line:no-debugger
  debugger;
  return n + 5;
}

CustomFunctionMappings['BlankSnippet.add10'] = add10;
CustomFunctionMappings['BlankSnippet.add5ish'] = add5ish;

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
    // tslint:disable-next-line:no-debugger
    debugger;
    console.log(data);
  } catch (e) {
    // If couldn't log, not much you can do about it.  Write to console.log just in case,
    // but that's not going to help much on an invisible runner...
    console.log(e);
  }
}
