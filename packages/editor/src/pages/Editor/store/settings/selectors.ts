import { IState } from '../reducer';
import { getActiveSolution, getActiveFile } from '../editor/selectors';
import { get as getHost } from '../host/selectors';
import {
  SETTINGS_SOLUTION_ID,
  READ_ONLY_FILE_IDS,
  ABOUT_FILE_ID,
} from '../../../../constants';
import { getTheme } from '../../../../theme';
import { defaultSettings } from '../../../../settings';

export const getIsOpen = (state: IState): boolean =>
  getActiveSolution(state).id === SETTINGS_SOLUTION_ID;

export const get = (state: IState): ISettings => ({
  ...defaultSettings,
  ...state.settings.userSettings,
});

export const getUser = (state: IState): Partial<ISettings> => state.settings.userSettings;

export const getMonacoTheme = (state: IState): 'vs' | 'vs-dark' | 'hc-black' => {
  return {
    light: 'vs',
    dark: 'vs-dark',
    'high-contrast': 'hc-black',
  }[get(state)['editor.theme']];
};

export const getPrettyEditorTheme = (state: IState): string => {
  return { light: 'Light', dark: 'Dark', 'high-contrast': 'High Contrast' }[
    get(state)['editor.theme']
  ];
};

export const getBackgroundColor = (state: IState): string => {
  const host = getHost(state);
  const theme = getTheme(host);
  return {
    light: theme.white,
    dark: theme.neutralDarker,
    'high-contrast': theme.black,
  }[get(state)['editor.theme']];
};
export const getTabSize = (state: IState): number => get(state)['editor.tabSize'];

export const getIsPrettierEnabled = (state: IState): boolean =>
  get(state)['editor.prettier'];
export const getIsAutoFormatEnabled = (state: IState): boolean =>
  get(state)['editor.prettier.autoFormat'];

export const getMonacoOptions = (
  state: IState,
): monaco.editor.IEditorConstructionOptions => {
  const settings = get(state);
  return {
    theme: getMonacoTheme(state),
    fontSize: settings['editor.fontSize'],
    lineHeight: settings['editor.fontSize'] * 1.35,
    fontFamily: [
      settings['editor.fontFamily'],
      'Menlo',
      'Source Code Pro',
      'Consolas',
      'Courier New',
      'monospace',
    ]
      .map(fontName => (fontName.includes(' ') ? JSON.stringify(fontName) : fontName))
      .join(', '),
    readOnly: READ_ONLY_FILE_IDS.includes(getActiveFile(state).id),
    lineNumbers: getActiveFile(state).id !== ABOUT_FILE_ID ? 'on' : 'off',
    minimap: { enabled: settings['editor.minimap'] },
    folding: settings['editor.folding'],
    wordWrap: settings['editor.wordWrap'],

    scrollbar: { vertical: 'visible', arrowSize: 15 },
    formatOnPaste: true,
    glyphMargin: false,
    fixedOverflowWidgets: true,
    ariaLabel: 'editor',
    wordWrapColumn: 120,
    wrappingIndent: 'indent',
    selectOnLineNumbers: true,
  };
};
