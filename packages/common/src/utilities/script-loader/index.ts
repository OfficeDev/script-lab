export async function addScriptTags(urls: string[]): Promise<void[]> {
  return Promise.all(urls.map(url => addScriptTag(url)));
}

export async function addScriptTag(url: string): Promise<void> {
  return new Promise<void>(resolve => {
    const allScriptElements = document.getElementsByTagName('script');
    const thisScriptElement = allScriptElements[allScriptElements.length - 1];
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute('src', url);
    scriptElement.onload = () => resolve();
    thisScriptElement.parentNode.insertBefore(
      scriptElement,
      thisScriptElement.nextSibling /* if null, will just insert at end, which is OK too */,
    );
  });
}
