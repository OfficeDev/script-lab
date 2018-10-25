import { IState } from '../reducer'
import { getActiveSolution, getActiveFile } from '../editor/selectors'
import { get as getHost } from '../host/selectors'
import { SETTINGS_SOLUTION_ID, READ_ONLY_FILE_IDS, ABOUT_FILE_ID } from '../../constants'
import { getTheme } from '../../theme'

export const getIsOpen = (state: IState): boolean =>
  getActiveSolution(state).id === SETTINGS_SOLUTION_ID

export const get = (state: IState): ISettings => state.settings.values

export const getMonacoTheme = (state: IState): 'vs' | 'vs-dark' | 'hc-black' => {
  return {
    light: 'vs',
    dark: 'vs-dark',
    'high-contrast': 'hc-black',
  }[state.settings.values.editor.theme]
}

export const getPrettyEditorTheme = (state: IState): string => {
  return {
    light: 'Light',
    dark: 'Dark',
    'high-contrast': 'High Contrast',
  }[state.settings.values.editor.theme]
}

export const getBackgroundColor = (state: IState): string => {
  const host = getHost(state)
  const theme = getTheme(host)
  return {
    light: theme.white,
    dark: theme.neutralDarker,
    'high-contrast': theme.black,
  }[state.settings.values.editor.theme]
}

export const getFontSize = (state: IState): number =>
  state.settings.values.editor.font.size
export const getFontFamily = (state: IState): string =>
  state.settings.values.editor.font.family

export const getIsMinimapEnabled = (state: IState): boolean =>
  state.settings.values.editor.minimap
export const getIsFoldingEnabled = (state: IState): boolean =>
  state.settings.values.editor.folding
export const getIsPrettierEnabled = (state: IState): boolean =>
  state.settings.values.editor.prettier.enabled
export const getIsAutoFormatEnabled = (state: IState): boolean =>
  state.settings.values.editor.prettier.autoFormat

export const getTabSize = (state: IState): number => state.settings.values.editor.tabSize

export const getWordWrap = (state: IState): 'on' | 'off' | 'bounded' =>
  state.settings.values.editor.wordWrap

export const getMonacoOptions = (
  state: IState,
): monaco.editor.IEditorConstructionOptions => {
  const editorSettings = state.settings.values.editor
  return {
    theme: getMonacoTheme(state),
    selectOnLineNumbers: true,
    fontSize: editorSettings.font.size,
    fontFamily: [
      editorSettings.font.family,
      'Menlo',
      'Source Code Pro',
      'Consolas',
      'Courier New',
      'monospace',
    ]
      .map(fontName => (fontName.includes(' ') ? JSON.stringify(fontName) : fontName))
      .join(', '),
    minimap: { enabled: editorSettings.minimap },
    scrollbar: { vertical: 'visible', arrowSize: 15 },
    formatOnPaste: true,
    lineHeight: editorSettings.font.size * 1.35,
    folding: editorSettings.folding,
    glyphMargin: false,
    fixedOverflowWidgets: true,
    ariaLabel: 'editor',
    wordWrap: editorSettings.wordWrap,
    wordWrapColumn: 120,
    wrappingIndent: 'indent',
    readOnly: READ_ONLY_FILE_IDS.includes(getActiveFile(state).id),
    lineNumbers: getActiveFile(state).id !== ABOUT_FILE_ID ? 'on' : 'off',
  }
}
