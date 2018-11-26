import createGUID from 'uuid';
import { LIBRARIES_FILE_NAME, SCRIPT_FILE_NAME } from '../constants';
import { getBoilerplateFiles } from '../newSolutionData';

export const getObjectValues = (dict: object): any[] =>
  Object.keys(dict).map(key => dict[key]);

export function setUpMomentJsDurationDefaults(momentInstance: {
  relativeTimeThreshold(threshold: string, limit: number): boolean;
}) {
  momentInstance.relativeTimeThreshold('s', 40);
  // Note, per documentation, "ss" must be set after "s"
  momentInstance.relativeTimeThreshold('ss', 1);
  momentInstance.relativeTimeThreshold('m', 40);
  momentInstance.relativeTimeThreshold('h', 20);
  momentInstance.relativeTimeThreshold('d', 25);
  momentInstance.relativeTimeThreshold('M', 10);
}

export function pause(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

const EXT_TO_LANG_MAP = {
  js: 'JavaScript',
  ts: 'TypeScript',
  html: 'HTML',
  css: 'CSS',
};

export function convertExtensionToLanguage(file): string {
  if (!file) {
    return '';
  }

  const extension = file.name.split('.').pop();
  if (extension) {
    return EXT_TO_LANG_MAP[extension.toLowerCase()] || '';
  }
  return '';
}

const createFile = (name, { content, language }): IFile => ({
  id: createGUID(),
  name,
  content,
  language,
  dateCreated: Date.now(),
  dateLastModified: Date.now(),
});

export const convertSnippetToSolution = (snippet: ISnippet): ISolution => {
  const { name, description, script, template, style, libraries, host } = snippet;

  const defaultFiles = getBoilerplateFiles(Date.now());

  const files = Object.entries({
    [SCRIPT_FILE_NAME]: script,
    'index.html': template,
    'index.css': style,
    [LIBRARIES_FILE_NAME]: { content: libraries, language: 'libraries' },
  }).map(([fileName, file]) =>
    file
      ? createFile(fileName, file)
      : defaultFiles.find(file => file.name === fileName)!,
  ) as IFile[];

  const solution = {
    id: createGUID(),
    name,
    host,
    description,
    options: {},
    files,
    dateCreated: Date.now(),
    dateLastModified: Date.now(),
  };

  return solution;
};

export const convertSolutionToSnippet = (solution: ISolution): ISnippet => {
  const { id, name, description, host, files } = solution;

  const snippetFiles = Object.entries({
    script: file => file.name === SCRIPT_FILE_NAME,
    template: file => file.name === 'index.html',
    style: file => file.name === 'index.css',
    libraries: file => file.name === LIBRARIES_FILE_NAME,
  })
    .map(([fileName, fileSelector]) => [fileName, files.find(fileSelector)])
    .filter(([fileName, file]) => file !== undefined)
    .reduce((obj, [fileName, file]) => {
      const name = fileName as string;
      const f = file as IFile;
      return {
        ...obj,
        [name]:
          f.name === LIBRARIES_FILE_NAME
            ? f.content
            : { content: f.content, language: f.language },
      };
    }, {});

  return {
    id,
    name,
    description,
    host,
    api_set: {},
    ...snippetFiles,
  };
};

export function stringifyPlusPlus(object: any): string {
  if (object === null) {
    return 'null';
  }

  if (typeof object === 'undefined') {
    return 'undefined';
  }

  // Don't JSON.stringify strings, because we don't want quotes in the output
  if (typeof object === 'string') {
    return object;
  }

  if (object instanceof Error) {
    try {
      return 'Error: ' + '\n' + jsonStringify(object);
    } catch (e) {
      return stringifyPlusPlus(object.toString());
    }
  }
  if (object.toString() !== '[object Object]') {
    return object.toString();
  }

  // Otherwise, stringify the object
  return jsonStringify(object);
}

function jsonStringify(object: any): string {
  return JSON.stringify(
    object,
    (key, value) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return getStringifiableSnapshot(value);
      }
      return value;
    },
    4,
  );

  function getStringifiableSnapshot(object: any) {
    const snapshot: any = {};

    try {
      let current = object;

      do {
        Object.getOwnPropertyNames(current).forEach(tryAddName);
        current = Object.getPrototypeOf(current);
      } while (current);

      return snapshot;
    } catch (e) {
      return object;
    }

    function tryAddName(name: string) {
      const hasOwnProperty = Object.prototype.hasOwnProperty;
      if (name.indexOf(' ') < 0 && !hasOwnProperty.call(snapshot, name)) {
        Object.defineProperty(snapshot, name, {
          configurable: true,
          enumerable: true,
          get: () => object[name],
        });
      }
    }
  }
}

export function invokeGlobalErrorHandler(error: any) {
  console.error('Global error handler:');
  console.error(error);

  const loadingElement = document.getElementById('loading')!;
  const rootElement = document.getElementById('root');

  loadingElement.style.visibility = 'initial';

  const subtitleElement = document.querySelectorAll('#loading h2')[0] as HTMLElement;

  const fromOldErrorIfAny = document.querySelectorAll('#loading .error');
  fromOldErrorIfAny.forEach(item => item.parentNode!.removeChild(item));

  subtitleElement.innerHTML = 'An unexpected error has occurred.';

  const clickForMoreInfoElement = document.createElement('a');
  clickForMoreInfoElement.href = '#';
  clickForMoreInfoElement.className = 'ms-font-m error';
  clickForMoreInfoElement.textContent = 'Click for more info';
  clickForMoreInfoElement.addEventListener('click', () => {
    const errorMessageElement = document.createElement('pre');
    errorMessageElement.textContent = stringifyPlusPlus(error);
    loadingElement.insertBefore(errorMessageElement, clickForMoreInfoElement);
    clickForMoreInfoElement!.parentNode!.removeChild(clickForMoreInfoElement);
  });
  loadingElement.insertBefore(clickForMoreInfoElement, null);

  const closeElement = document.createElement('a');
  closeElement.href = '#';
  closeElement.className = 'ms-font-m error';
  closeElement.textContent = 'Close';
  closeElement.addEventListener('click', () => {
    loadingElement.style.visibility = 'hidden';
    rootElement!.style.display = 'initial';
  });
  loadingElement.insertBefore(closeElement, null);

  // If this is (somehow) the second time that the event handler is ignored, do some cleanup
  const previousErrorMessageElement: HTMLElement = document.querySelectorAll(
    '#loading pre',
  )[0] as HTMLElement;
  if (previousErrorMessageElement) {
    loadingElement.removeChild(previousErrorMessageElement);
  }

  // Remove the loading dots (surrounding with if-statement safety check in case this is invoked twice)
  const loadingDotsElement = document.querySelectorAll(
    '#loading .loading-indicator',
  )[0] as HTMLElement;
  if (loadingDotsElement) {
    loadingDotsElement.parentNode!.removeChild(loadingDotsElement);
  }

  rootElement!.style.display = 'none';

  return true;
}
