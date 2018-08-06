import {
  SETTINGS_SOLUTION_ID,
  SETTINGS_FILE_ID,
  SETTINGS_JSON_LANGUAGE,
  ABOUT_FILE_ID,
} from './constants'

export const defaultSettings: ISettings = {
  theme: 'dark',
}

const getSettingsFiles = (timestamp: number): IFile[] => [
  {
    id: SETTINGS_FILE_ID,
    name: 'Settings',
    dateCreated: timestamp,
    dateLastModified: timestamp,
    language: SETTINGS_JSON_LANGUAGE,
    content: JSON.stringify(defaultSettings),
  },
  {
    id: ABOUT_FILE_ID,
    name: 'About',
    dateCreated: timestamp,
    dateLastModified: timestamp,
    language: 'plaintext',
    content: `Version 2.0.0`,
  },
]

const getSettingsSolution = (files: IFile[], timestamp: number): ISolution => ({
  id: SETTINGS_SOLUTION_ID,
  name: 'User Settings',
  dateCreated: timestamp,
  dateLastModified: timestamp,
  host: 'ALL',
  files: files.map(f => f.id),
})

export const getSettingsSolutionAndFiles = (): {
  solution: ISolution
  files: IFile[]
} => {
  const now = Date.now()
  const files = getSettingsFiles(now)
  const solution = getSettingsSolution(files, now)
  return { solution, files }
}
