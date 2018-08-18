import { IState } from '../reducer'

export const getMonacoTheme = (state: IState): 'vs' | 'vs-dark' | 'hc-black' => {
  return {
    light: 'vs',
    dark: 'vs-dark',
    'high-contrast': 'hc-black',
  }[state.settings.editor.theme]
}

export const getFontSize = (state: IState): number => state.settings.editor.font.size
export const getFontFamily = (state: IState): string => state.settings.editor.font.family
export const getLineHeight = (state: IState): number =>
  state.settings.editor.font.lineHeight

export const getIsMinimapEnabled = (state: IState): boolean =>
  state.settings.editor.minimap
export const getIsFoldingEnabled = (state: IState): boolean =>
  state.settings.editor.folding
export const getIsPrettierEnabled = (state: IState): boolean =>
  state.settings.editor.prettier

export const getTabSize = (state: IState): number => state.settings.editor.tabSize
