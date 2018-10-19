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
    font: { family: 'Menlo', size: 14 },
    minimap: false,
    tabSize: 2,
    prettier: {
      enabled: true,
      autoFormat: true,
    },
    folding: true,
    wordWrap: 'bounded',
  },
  environment: environmentName,
}

const getSettingsContent = (settings?: ISettings): string => {
  const settingsToSet = settings !== undefined ? settings : defaultSettings
  settingsToSet.environment = environmentName
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

export const allowedSettings = {
  editor: {
    theme: ['dark', 'light', 'high-contrast'],
    font: { family: ['Menlo', 'Consolas', 'Courier New', 'Source Code Pro'] },
    wordWrap: ['bounded', 'on', 'off'],
  },
  environment: ['production', 'beta', 'alpha', 'react-beta', 'react-alpha', 'local'],
}

// Note: this must be kept in sync with the interfaces in src/interfaces/index.d.ts
export const schema = {
  $id: 'settings-schema.json',
  description: 'Schema for the settings of Script Lab',
  type: 'object',
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
  properties: {
    editor: {
      $id: '/properties/editor',
      type: 'object',
      additionalProperties: false,
      required: true,
      properties: {
        theme: {
          $id: '/properties/editor/properties/theme',
          type: 'string',
          required: true,
          default: defaultSettings.editor.theme,
          enum: allowedSettings.editor.theme,
        },
        font: {
          $id: '/properties/editor/properties/font',
          type: 'object',
          required: true,
          additionalProperties: false,
          properties: {
            family: {
              $id: '/properties/editor/properties/font/properties/family',
              type: 'string',
              required: true,
              default: defaultSettings.editor.font.family,
              enum: allowedSettings.editor.font.family,
            },
            size: {
              $id: '/properties/editor/properties/font/properties/size',
              type: 'integer',
              required: true,
              default: defaultSettings.editor.font.size,
              examples: [12, 14, 16, 18, 24],
            },
          },
        },
        minimap: {
          $id: '/properties/editor/properties/minimap',
          type: 'boolean',
          required: true,
          default: defaultSettings.editor.minimap,
          examples: [false, true],
        },
        tabSize: {
          $id: '/properties/editor/properties/tabSize',
          type: 'integer',
          required: true,
          default: defaultSettings.editor.tabSize,
          examples: [2, 4],
        },
        prettier: {
          $id: '/properties/editor/properties/prettier',
          type: 'object',
          required: true,
          additionalProperties: false,
          properties: {
            enabled: {
              $id: '/properties/editor/properties/prettier/properties/enabled',
              type: 'boolean',
              required: true,
              default: defaultSettings.editor.prettier.enabled,
              examples: [true, false],
            },
            autoFormat: {
              $id: '/properties/editor/properties/prettier/properties/autoFormat',
              type: 'boolean',
              required: true,
              default: defaultSettings.editor.prettier.autoFormat,
              examples: [true, false],
            },
          },
        },
        folding: {
          $id: '/properties/editor/properties/folding',
          type: 'boolean',
          required: true,
          default: defaultSettings.editor.folding,
          examples: [true, false],
        },
        wordWrap: {
          $id: '/properties/editor/properties/wordWrap',
          type: 'string',
          required: true,
          default: defaultSettings.editor.wordWrap,
          enum: allowedSettings.editor.wordWrap,
        },
      },
    },
    environment: {
      $id: 'properties/environment',
      type: 'string',
      required: true,
      default: defaultSettings.environment,
      enum: allowedSettings.environment.filter(value => value !== 'local'),
    },
  },
}
