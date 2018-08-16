import { getType } from 'typesafe-actions'
import { defaultSettings } from '../defaultSettings'
import { settings as settingsActions, ISettingsAction } from '../actions'
import { defaultTheme } from '../theme'

const settings = (state: ISettings = defaultSettings, action: ISettingsAction) => {
  switch (action.type) {
    case getType(settingsActions.edit.success):
      return action.payload.settings
    default:
      return state
  }
}

export default settings

// theme
export const getMonacoTheme = (state: ISettings): 'vs' | 'vs-dark' | 'hc-black' => {
  return {
    light: 'vs',
    dark: 'vs-dark',
    'high-contrast': 'hc-black',
  }[state.editor.theme]
}

// TODO(nicobell): figure out how to properly handle this case
export const getBackgroundColor = (state: ISettings): string => {
  return {
    light: defaultTheme.fg,
    dark: defaultTheme.bg,
    'high-contrast': 'black',
  }[state.editor.theme]
}

// font
export const getFontSize = (state: ISettings): number => state.editor.font.size
export const getFontFamily = (state: ISettings): string => state.editor.font.family
export const getLineHeight = (state: ISettings): number => state.editor.font.lineHeight

export const getIsMinimapEnabled = (state: ISettings): boolean => state.editor.minimap
export const getIsFoldingEnabled = (state: ISettings): boolean => state.editor.folding
export const getIsPrettierEnabled = (state: ISettings): boolean => state.editor.prettier

export const getTabSize = (state: ISettings): number => state.editor.tabSize

// TODO: linter

// ----------------------

export const selectors = {
  getMonacoTheme,
  getBackgroundColor,
  getFontSize,
  getFontFamily,
  getLineHeight,
  getIsMinimapEnabled,
  getIsFoldingEnabled,
  getIsPrettierEnabled,
  getTabSize,
}
