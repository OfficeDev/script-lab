import {
  SETTINGS_SOLUTION_ID,
  SETTINGS_FILE_ID,
  SETTINGS_JSON_LANGUAGE,
  ABOUT_FILE_ID,
} from './constants'

import { environmentName } from './environment'

export const defaultSettings: ISettings = {
  editor: {
    theme: 'dark',
    font: { family: 'Menlo', size: 18, lineHeight: 24 },
    minimap: false,
    tabSize: 2,
    prettier: true,
    folding: true,
    linter: { mode: 'warning' },
  },
  hostSpecific: { officeOnline: { openEditorInNewTab: 'prompt' } },
  defaultActions: { applySettings: 'prompt', gistImport: 'prompt' },
  developer: {
    environment: environmentName,
  },
}

const getSettingsContent = (settings?: ISettings): string => {
  const settingsToSet = settings !== undefined ? settings : defaultSettings
  settingsToSet.developer.environment = environmentName
  const { tabSize } = settingsToSet.editor
  return JSON.stringify(settingsToSet, null, tabSize) + '\n'
}

const getAboutContent = (): string => {
  const commit = process.env.REACT_APP_COMMIT
  const lastUpdated = process.env.REACT_APP_LAST_UPDATED
  return `Last Updated: ${lastUpdated}\nCommit: ${commit}\nEnvironment: ${environmentName}`
}

const getSettingsFiles = (timestamp: number, settings?: ISettings): IFile[] => [
  {
    id: SETTINGS_FILE_ID,
    name: 'Settings',
    dateCreated: timestamp,
    dateLastModified: timestamp,
    language: SETTINGS_JSON_LANGUAGE,
    content: getSettingsContent(settings),
  },
  {
    id: ABOUT_FILE_ID,
    name: 'About',
    dateCreated: timestamp,
    dateLastModified: timestamp,
    language: 'plaintext',
    content: getAboutContent(),
  },
]

const getSettingsSolution = (
  files: IFile[],
  timestamp: number,
): ISolutionWithFileIds => ({
  id: SETTINGS_SOLUTION_ID,
  name: 'User Settings',
  dateCreated: timestamp,
  dateLastModified: timestamp,
  host: 'ALL',
  files: files.map(f => f.id),
})

export const getSettingsSolutionAndFiles = (
  settings?: ISettings,
): {
  solution: ISolutionWithFileIds
  files: IFile[]
} => {
  const now = Date.now()
  const files = getSettingsFiles(now, settings)
  const solution = getSettingsSolution(files, now)
  return { solution, files }
}
