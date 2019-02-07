/** Namespaces for the runner wrapper to share with the inner snippet iframe */
export const officeNamespacesForIframe = [
  'Office',
  'OfficeExtension',
  'OfficeCore',
  'OfficeRuntime',
  'Excel',
  'Word',
  'OneNote',
  'PowerPoint',
  'Visio',
  'ExcelOp',

  // Also transfer over the "Error" object, so that "instanceof Error" works correctly
  //    when an error is moved from the iframe to the Console.
  'Error',
];

/** Namespaces for the custom functions Iframe-s to share with their overarching page. */
export const officeNamespacesForCustomFunctionsIframe = [
  'ScriptLabCustomFunctionsDictionary',
  'CustomFunctions',
  'OfficeRuntime',
  'Office',
  'OfficeExtension',
];

export const SILENT_SNIPPET_SWITCHING = true;

export const PATHS = {
  CustomFunctionsRunner: '/custom-functions',
  Runner: '/',
};
