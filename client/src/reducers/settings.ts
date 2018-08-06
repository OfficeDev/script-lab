import { getType } from 'typesafe-actions'
import { defaultSettings } from '../defaultSettings'
import { files, IFilesAction } from '../actions'
import { SETTINGS_FILE_ID } from '../constants'
import theme from '../theme'

const allowedSettingOptions = {
  theme: ['light', 'dark', 'high-contrast'],
}

export const parseSettings = (
  currentSettings: ISettings,
  settingsJSON: string,
): ISettings => {
  try {
    const availableSettings = Object.keys(currentSettings)
    const parsedSettings = JSON.parse(settingsJSON)
    const filteredSettings = Object.keys(parsedSettings)
      .filter(setting => availableSettings.includes(setting))
      .filter(setting => allowedSettingOptions[setting].includes(parsedSettings[setting]))
      .reduce(
        (all, setting) => ((all[setting] = parsedSettings[setting]), all),
        currentSettings,
      )

    return filteredSettings
  } catch (e) {
    return currentSettings
  }
}

const settings = (state: ISettings = defaultSettings, action: IFilesAction) => {
  switch (action.type) {
    case getType(files.edit):
      if (action.payload.fileId === SETTINGS_FILE_ID && action.payload.file.content) {
        return parseSettings(state, action.payload.file.content)
      }
    default:
      return state
  }
}

export default settings

// theme
export const getMonacoTheme = (state): 'vs' | 'vs-dark' | 'hc-black' => {
  return {
    light: 'vs',
    dark: 'vs-dark',
    'high-contrast': 'hc-black',
  }[state.theme]
}

export const getBackgroundColor = (state): string => {
  return {
    light: theme.fg,
    dark: theme.bg,
    'high-contrast': 'black',
  }[state.theme]
}
// ----------------------

export const selectors = {
  getMonacoTheme,
  getBackgroundColor,
}
