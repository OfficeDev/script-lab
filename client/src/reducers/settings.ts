import { getType } from 'typesafe-actions'
import { defaultSettings } from '../defaultSettings'
import { files, IFilesAction } from '../actions'
import { SETTINGS_FILE_ID } from '../constants'
import theme from '../theme'

import { allowedSettings } from '../SettingsJSONSchema'

export const merge = (valid, parsed, allowed) => {
  console.log({ valid, parsed, allowed })
  return Object.keys(valid)
    .map(setting => {
      if (parsed !== undefined && parsed[setting] !== undefined) {
        if (valid[setting] instanceof Object) {
          return [setting, merge(valid[setting], parsed[setting], allowed[setting])]
        } else if (
          allowed !== undefined &&
          allowed[setting] &&
          allowed[setting].includes(parsed[setting])
        ) {
          return [setting, parsed[setting]]
        }
      }

      return [setting, valid[setting]]
    })
    .reduce((acc, [key, value]) => ((acc[key] = value), acc), {})
}

export const parseSettings = (
  currentSettings: ISettings,
  settingsJSON: string,
): ISettings => {
  try {
    const parsed = JSON.parse(settingsJSON)

    return merge(currentSettings, parsed, allowedSettings)
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
  }[state.editor.theme]
}

export const getBackgroundColor = (state): string => {
  return {
    light: theme.fg,
    dark: theme.bg,
    'high-contrast': 'black',
  }[state.editor.theme]
}
// ----------------------

export const selectors = {
  getMonacoTheme,
  getBackgroundColor,
}
