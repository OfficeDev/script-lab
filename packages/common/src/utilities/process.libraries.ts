export default function processLibraries(
  libraries: string,
  isInsideOffice: boolean,
): { linkReferences: string[]; scriptReferences: string[]; officeJs: string | null } {
  const linkReferences: string[] = [];
  const scriptReferences: string[] = [];
  let officeJs: string | null = null;

  libraries.split('\n').forEach(processLibrary);

  if (!isInsideOffice) {
    officeJs = null;
  }

  return { linkReferences, scriptReferences, officeJs };

  function processLibrary(text: string) {
    if (text == null) {
      return null;
    }

    text = text.trim();

    if (text === '' || text.startsWith('#') || text.startsWith('//')) {
      return null;
    }

    const isDts = /^@types/.test(text) || /^dt~/.test(text) || /\.d\.ts$/i.test(text);

    if (isDts) {
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
      const officeJsRegex = /.*office(\.(experimental))?(\.debug)?\.js$/;
      /* captures:
          https://office.js
          https://office.debug.js
          https://office.experimental.js
          https://office.experimental.debug.js
        fails on:
          https://office.fooooo.debug.js
          https://officedebug.js
          https://officeydebug.js
      */
      if (officeJsRegex.test(resolvedUrlPath.toLowerCase())) {
        officeJs = resolvedUrlPath;
        return null;
      }

      return scriptReferences.push(resolvedUrlPath);
    }

    return scriptReferences.push(resolvedUrlPath);
  }
}
