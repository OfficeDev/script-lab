export async function checkForUnsupportedAPIsIfRelevant(snippet: ISnippet) {
  const { host } = await Office.onReady();
  const isInsideOfficeApp = !!host;
  // On the web, there is no "Office.context.requirements". So skip it.
  if (!isInsideOfficeApp) {
    return;
  }

  const desiredOfficeJS =
    processLibraries(snippet.libraries || '', isInsideOfficeApp).officeJS || '';
  if (
    desiredOfficeJS
      .toLowerCase()
      .includes('https://appsforoffice.microsoft.com/lib/1/hosted/')
  ) {
    // Snippets using production Office.js should be checked for API set support.
    // Snippets using the beta endpoint or an NPM package don't need to.
    return;
  }

  const apiSet = snippet.api_set || {};
  const apiTuples = Object.keys(apiSet).reduce(
    (arr, key) => [...arr, [key, apiSet[key]]],
    [],
  );
  apiTuples.forEach(([api, version]) => {
    if (!Office.context.requirements.isSetSupported(api as string, version as number)) {
      throw new Error(
        `${host} does not support the required API Set ${api} @ ${version}`,
      );
    }
  });
}

function processLibraries(libraries: string, isInsideOffice: boolean) {
  const linkReferences: string[] = [];
  const scriptReferences: string[] = [];
  let officeJS: string | null = null;

  libraries.split('\n').forEach(processLibrary);

  if (!isInsideOffice) {
    officeJS = '<none>';
  }

  return { linkReferences, scriptReferences, officeJS };

  function processLibrary(text: string) {
    if (text == null || text.trim() === '') {
      return null;
    }

    text = text.trim();

    const isNotScriptOrStyle =
      /^#.*|^\/\/.*|^\/\*.*|.*\*\/$.*/im.test(text) ||
      /^@types/.test(text) ||
      /^dt~/.test(text) ||
      /\.d\.ts$/i.test(text);

    if (isNotScriptOrStyle) {
      return null;
    }

    const resolvedUrlPath = /^https?:\/\/|^ftp? :\/\//i.test(text)
      ? text
      : `https://unpkg.com/${text}`;

    if (/\.css$/i.test(resolvedUrlPath)) {
      return linkReferences.push(resolvedUrlPath);
    }

    if (/\.ts$|\.js$/i.test(resolvedUrlPath)) {
      /*
       * Don't add Office.js to the rest of the script references --
       * it is special because of how it needs to be *outside* of the iframe,
       * whereas the rest of the script references need to be inside the iframe.
       */
      if (/(?:office|office.debug).js$/.test(resolvedUrlPath.toLowerCase())) {
        officeJS = resolvedUrlPath;
        return null;
      }

      return scriptReferences.push(resolvedUrlPath);
    }

    return scriptReferences.push(resolvedUrlPath);
  }
}
