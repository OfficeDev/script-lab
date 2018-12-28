import processLibraries from 'common/lib/utilities/process.libraries';

export async function checkForUnsupportedAPIsIfRelevant(snippet: ISnippet) {
  const { host } = await Office.onReady();
  const isInsideOfficeApp = !!host;
  // On the web, there is no "Office.context.requirements". So skip it.
  if (!isInsideOfficeApp) {
    return;
  }

  const desiredOfficeJS =
    processLibraries(snippet.libraries || '', isInsideOfficeApp).officeJs || '';
  const isProductionOfficeJs = desiredOfficeJS
    .toLowerCase()
    .includes('https://appsforoffice.microsoft.com/lib/1/hosted/');

  if (!isProductionOfficeJs) {
    // Snippets using production Office.js should be checked for API set support.
    // Snippets using the beta endpoint or an NPM package don't need to.
    return;
  }

  const apiSet = snippet.api_set || {};
  Object.entries(apiSet).forEach(([api, version]) => {
    if (!Office.context.requirements.isSetSupported(api as string, version as number)) {
      throw new Error(
        `${host} does not support the required API Set ${api} @ ${version}`,
      );
    }
  });
}
