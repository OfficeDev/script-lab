// import { officeNamespacesForCustomFunctionsIframe } from '../../src/constants';
// import { generateLogString, stringifyPlusPlus } from 'common/lib/utilities/string';
// import 'core-js/fn/array/find';

// (async () => {
//   overwriteConsole('[SYSTEM]', window);

//   const payload = getFakePayload();
//   await initializeRunnableSnippets(payload);
// })();
// ///////////////////////////////////////

// async function initializeRunnableSnippets(
//   payload: Array<{
//     solutionId: string;
//     namespace: string;
//     functionNames: string[];
//     code: string;
//     jsLibs: string[];
//   }>,
// ) {
//   return new Promise(resolve =>
//     tryCatch(() => {
//       let successfulRegistrationsCount = 0;

//       (window as any).scriptRunnerOnLoad = (contentWindow: Window) =>
//         tryCatch(() => {
//           (contentWindow as any).console = window.console;
//           contentWindow.onerror = (...args) => console.error(args);

//           officeNamespacesForCustomFunctionsIframe.forEach(namespace => {
//             (contentWindow as any)[namespace] = (window as any)[namespace];
//           });
//         });

//       (window as any).scriptRunnerEndInit = (iframeWindow: Window, id: string) =>
//         tryCatch(() => {
//           const snippetMetadata = payload.find(item => item.solutionId === id);
//           const namespaceUppercase = snippetMetadata.namespace.toUpperCase();

//           logIfExtraLoggingEnabled(
//             `Mapping custom functions from namespace ${
//               snippetMetadata.namespace
//             }, expecting ${snippetMetadata.functions.length} functions`,
//           );

//           snippetMetadata.functions.map(func => {
//             const funcFullUpperName = `${namespaceUppercase}.${func.funcName.toUpperCase()}`;

//             // Overwrite console.log on every snippet iframe
//             overwriteConsole(funcFullUpperName, iframeWindow);
//           });

//           successfulRegistrationsCount++;

//           if (successfulRegistrationsCount === metadataArray.length) {
//             resolve();
//           }
//         });

//       const snippetsHtmls: string[] = JSON.parse(atob(params.snippetsDataBase64));

//       snippetsHtmls.forEach(html => {
//         let $iframe = $(
//           '<iframe class="snippet-frame" src="about:blank"></iframe>',
//         ).appendTo('body');
//         let iframe = $iframe[0] as HTMLIFrameElement;
//         let { contentWindow } = iframe;

//         // Write to the iframe (and note that must do the ".write" call first,
//         // before setting any window properties). Setting console and onerror here
//         // (for any initial logging or error handling from snippet-referenced libraries),
//         // but for extra safety also setting them inside of scriptRunnerInitialized.
//         contentWindow.document.open();
//         contentWindow.document.write(html);
//         (contentWindow as any).console = window.console;
//         contentWindow.onerror = (...args) => {
//           handleError({ error: args });
//         };
//         contentWindow.document.close();
//       });
//     }),
//   );
// }

// function overwriteConsole(source: '[SYSTEM]' | string, windowObject: Window) {
//   const logTypes: ConsoleLogTypes[] = ['log', 'info', 'warn', 'error'];
//   logTypes.forEach(
//     methodName =>
//       ((windowObject.console as any)[methodName] = consoleMsgTypeImplementation(
//         methodName,
//       )),
//   );

//   function consoleMsgTypeImplementation(severityType: ConsoleLogTypes) {
//     return (...args: any[]) => {
//       const { severity, message } = generateLogString(args, severityType);

//       tryToSendLog({
//         source,
//         severity,
//         message,
//       });
//     };
//   }
// }

// function tryToSendLog(data: { source: string; severity: string; message: string }) {
//   try {
//     // tslint:disable-next-line:no-debugger
//     debugger;
//     console.log(data);
//   } catch (e) {
//     // If couldn't log, not much you can do about it.  Write to console.log just in case,
//     // but that's not going to help much on an invisible runner...
//     console.log(e);
//   }
// }

// async function tryCatch(func: () => any) {
//   try {
//     await func();
//   } catch (e) {
//     handleError(e);
//   }
// }

// function handleError(error: Error | any) {
//   tryToSendLog({
//     message: stringifyPlusPlus(error),
//     severity: 'error',
//     source: '[SYSTEM]',
//   });
// }

// // FIXME: Zlatkovsky
// function getFakePayload() {
//   return [
//     {
//       solutionId: 'FooBar',
//       namespace: 'FooBar',
//       functionNames: ['foo', 'bar'],
//       code:
//         '/** @customFunction */\r\nfunction foo() {\r\n    return 42;\r\n}\r\n/** @customFunction */\r\nfunction bar() {\r\n    return 43;\r\n}\r\n',
//       jsLibs: [
//         'https://unpkg.com/core-js@2.4.1/client/core.min.js',
//         'https://unpkg.com/@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js',
//         'https://unpkg.com/jquery@3.1.1',
//       ],
//     },
//     {
//       solutionId: 'asdfasdfasd2323423432',
//       namespace: 'BlankSnippet',
//       functionNames: ['add10', 'add5ish'],
//       code:
//         '/** @CustomFunction */\r\nfunction add10(x) {\r\n    return x + 10;\r\n}\r\n/** @CustomFunction */\r\nfunction add5ish(x) {\r\n    var num = Math.random();\r\n    console.log(num);\r\n    return x + num + 5;\r\n}\r\n',
//       jsLibs: [
//         'https://unpkg.com/core-js@2.4.1/client/core.min.js',
//         'https://unpkg.com/@microsoft/office-js-helpers@0.7.4/dist/office.helpers.min.js',
//         'https://unpkg.com/jquery@3.1.1',
//       ],
//     },
//   ];
// }
