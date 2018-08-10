import { getType } from 'typesafe-actions'
import { defaultSettings } from '../defaultSettings'
import { files, IFilesAction } from '../actions'
import { SETTINGS_FILE_ID } from '../constants'
import theme from '../theme'

import { allowedSettings } from '../SettingsJSONSchema'

export const merge = (valid, parsed, allowed) => {
  return Object.keys(valid)
    .filter(setting => parsed[setting] !== undefined)
    .map(setting => {
      if (valid[setting] instanceof Object) {
        return merge(valid[setting], parsed[setting], allowed[setting])
      } else {
        if (allowed !== undefined && allowed[setting].includes(parsed[setting])) {
          return parsed[setting]
        } else {
          return valid[setting]
        }
      }
    })
}

export const parseSettings = (
  currentSettings: ISettings,
  settingsJSON: string,
): ISettings => {
  try {
    const current = Object.keys(currentSettings)
    const parsed = JSON.parse(settingsJSON)

    // const filteredSettings = Object.keys(parsedSettings)
    //   .filter(setting => availableSettings.includes(setting))
    //   .filter(setting => allowedSettingOptions[setting].includes(parsedSettings[setting]))
    //   .reduce(
    //     (all, setting) => ((all[setting] = parsedSettings[setting]), all),
    //     currentSettings,
    //   )
    return currentSettings
    // return filteredSettings
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
