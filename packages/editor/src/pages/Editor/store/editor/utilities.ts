import prettier from 'prettier/standalone';
import librariesIntellisenseJSON from './librariesIntellisense';
import { schema as SettingsSchema } from '../settings/utilities';
import { USER_SETTINGS_FILE_ID } from '../../../../constants';

export function doesMonacoExist() {
  return !!(window as any).monaco;
}

export const REGEX = {
  STARTS_WITH_TYPINGS: /^.types\/.+|^dt~.+/i,
  STARTS_WITH_COMMENT: /^#.*|^\/\/.*|^\/\*.*|.*\*\/$.*/im,
  ENDS_WITH_CSS: /.*\.css$/i,
  ENDS_WITH_DTS: /.*\.d\.ts$/i,
  GLOBAL: /^.*/i,
  TRIPLE_SLASH_REF: /\/\/\/\s*<reference\spath="(.+\.d\.ts)"\s*\/>/gm,
};

export function registerLibrariesMonacoLanguage() {
  if (!doesMonacoExist()) {
    return;
  }

  monaco.languages.register({ id: 'libraries' });
  monaco.languages.setMonarchTokensProvider('libraries', {
    tokenizer: {
      root: [
        { regex: REGEX.STARTS_WITH_COMMENT, action: { token: 'comment' } },
        { regex: REGEX.ENDS_WITH_CSS, action: { token: 'number' } },
        { regex: REGEX.STARTS_WITH_TYPINGS, action: { token: 'string' } },
        { regex: REGEX.ENDS_WITH_DTS, action: { token: 'string' } },
        { regex: REGEX.GLOBAL, action: { token: 'keyword' } },
      ],
    },
    tokenPostfix: '',
  });

  monaco.languages.registerCompletionItemProvider('libraries', {
    provideCompletionItems: (model, position) => {
      const currentLine = model.getValueInRange({
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: 1,
        endColumn: position.column,
      });

      if (REGEX.STARTS_WITH_COMMENT.test(currentLine)) {
        return { suggestions: [] };
      }

      if (currentLine === '') {
        return {
          suggestions: librariesIntellisenseJSON.map(library => {
            let insertText = '';

            if (Array.isArray(library.value)) {
              insertText += library.value.join('\n');
            } else {
              insertText += library.value || '';
              insertText += '\n';
            }

            if (Array.isArray(library.typings)) {
              insertText += (library.typings as string[]).join('\n');
            } else {
              insertText += library.typings || '';
              insertText += '\n';
            }

            const suggestion: monaco.languages.CompletionItem = {
              label: library.label,
              documentation: library.description,
              kind: monaco.languages.CompletionItemKind.Module,
              insertText,
              range: null /* range appears to be a required parameter starting in 0.16.0+,
                but seems OK with null and to default to reasonable behavior */,
            };

            return suggestion;
          }),
        };
      }

      return { suggestions: [] };
    },
  });
}

export function registerSettingsMonacoLanguage() {
  // Note, this doesn't appear to be working:
  // Issue tracking it:  https://github.com/OfficeDev/script-lab/issues/656
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [
      {
        uri: SettingsSchema.$id,
        fileMatch: [monaco.Uri.file(USER_SETTINGS_FILE_ID).toString()],
        schema: SettingsSchema,
      },
    ],
  });
}

export interface IPrettierSettings {
  tabWidth: number;
}

export function enablePrettierInMonaco(prettierSettings: IPrettierSettings) {
  import('prettier/parser-typescript').then(prettierTypeScript => {
    /* Adds Prettier Formatting to Monaco for TypeScript */
    const prettierTypeScriptFormatter: monaco.languages.DocumentFormattingEditProvider = {
      provideDocumentFormattingEdits: (
        document: monaco.editor.ITextModel,
        _options: monaco.languages.FormattingOptions,
        _token: monaco.CancellationToken,
      ): monaco.languages.TextEdit[] => {
        const text = document.getValue();
        const formatted = runTypeScriptPrettier(
          prettierTypeScript,
          text,
          prettierSettings,
        );

        return [
          {
            range: document.getFullModelRange(),
            text: formatted,
          },
        ];
      },
    };

    monaco.languages.registerDocumentFormattingEditProvider(
      'typescript',
      prettierTypeScriptFormatter,
    );
  });
}

export async function formatTypeScriptFile(
  content: string,
  prettierSettings: IPrettierSettings,
): Promise<string> {
  return import('prettier/parser-typescript').then(prettierTypeScript => {
    return runTypeScriptPrettier(prettierTypeScript, content, prettierSettings);
  });
}

function runTypeScriptPrettier(
  prettierTS: any,
  content: string,
  prettierSettings: IPrettierSettings,
) {
  try {
    return prettier.format(content, {
      parser: 'typescript',
      plugins: [prettierTS],
      tabWidth: prettierSettings.tabWidth,
      arrowParens: 'always',
      printWidth: 120,
    });
  } catch (e) {
    /** On failure, just return the content as it was, without formatting.
     * (Otherwise, was bubbling up the error, as in issue https://github.com/OfficeDev/script-lab-react/issues/418)
     */
    return content;
  }
}

export function parseTripleSlashRefs(url: string, content: string) {
  let match = REGEX.TRIPLE_SLASH_REF.exec(content);
  REGEX.TRIPLE_SLASH_REF.lastIndex = 0;
  if (!match) {
    return [];
  }
  let copyContent = content;

  const splitUrl = url.split('/');
  const baseUrl = splitUrl.slice(0, splitUrl.length - 1).join('/');

  const additionalUrls: string[] = [];

  while (match) {
    const [ref, path] = match;

    const newUrl = `${baseUrl}/${path}`;
    additionalUrls.push(newUrl);
    copyContent = copyContent.replace(ref, '');

    match = REGEX.TRIPLE_SLASH_REF.exec(copyContent);
    REGEX.TRIPLE_SLASH_REF.lastIndex = 0;
  }

  return additionalUrls;
}

const libraryCache: { [url: string]: string | null } = {};
export async function fetchLibraryContent(url: string): Promise<string | null> {
  if (url in libraryCache) {
    return libraryCache[url];
  }

  const response = await fetch(url);
  const content = response.ok ? await response.text() : null;

  libraryCache[url] = content;

  return content;
}
