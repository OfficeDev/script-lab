import YAML from 'js-yaml';

import {
  SETTINGS_SOLUTION_ID,
  USER_SETTINGS_FILE_ID,
  DEFAULT_SETTINGS_FILE_ID,
  SETTINGS_JSON_LANGUAGE,
  ABOUT_FILE_ID,
} from '../../../../constants';

import { environmentDisplayName } from 'common/lib/environment';

export const defaultSettings: ISettings = {
  'editor.theme': 'dark',
  'editor.fontFamily': 'Menlo',
  'editor.fontSize': 14,
  'editor.minimap': false,
  'editor.tabSize': 2,
  'editor.prettier': true,
  'editor.prettier.autoFormat': true,
  'editor.folding': true,
  'editor.wordWrap': 'bounded',
};

export const invisibleDefaultSettings: { [key: string]: any } = {};

const getTabSize = (userSettings: Partial<ISettings>): number =>
  userSettings && userSettings['editor.tabSize']
    ? userSettings['editor.tabSize']!
    : defaultSettings['editor.tabSize'];

const getDefaultSettingsContent = (userSettings: Partial<ISettings>): string => {
  const tabSize = getTabSize(userSettings);
  return YAML.safeDump(defaultSettings, { indent: tabSize });
};

const getUserSettingsContent = (userSettings: Partial<ISettings>): string => {
  if (Object.keys(userSettings).length === 0) {
    return '';
  }

  const tabSize = getTabSize(userSettings);
  return YAML.safeDump(userSettings, { indent: tabSize });
};

const getAboutContent = (): string => {
  const commit = process.env.REACT_APP_COMMIT;
  const lastUpdated = process.env.REACT_APP_LAST_UPDATED;
  return [
    `Last Updated: ${lastUpdated}`,
    `Commit: https://github.com/OfficeDev/script-lab-react/commits/${commit}`,
    `Environment: ${environmentDisplayName}`,
  ].join('\n');
};

const getSettingsFiles = (
  timestamp: number,
  userSettings: Partial<ISettings>,
): IFile[] => [
  {
    id: USER_SETTINGS_FILE_ID,
    name: 'User Settings',
    dateCreated: timestamp,
    dateLastModified: timestamp,
    dateLastOpened: timestamp,
    language: SETTINGS_JSON_LANGUAGE,
    content: getUserSettingsContent(userSettings),
  },
  {
    id: DEFAULT_SETTINGS_FILE_ID,
    name: 'Default Settings',
    dateCreated: timestamp,
    dateLastModified: timestamp,
    dateLastOpened: timestamp,
    language: SETTINGS_JSON_LANGUAGE,
    content: getDefaultSettingsContent(userSettings),
  },
  {
    id: ABOUT_FILE_ID,
    name: 'About',
    dateCreated: timestamp,
    dateLastModified: timestamp,
    dateLastOpened: timestamp,
    language: 'plaintext',
    content: getAboutContent(),
  },
];

const getSettingsSolution = (
  files: IFile[],
  timestamp: number,
): ISolutionWithFileIds => ({
  id: SETTINGS_SOLUTION_ID,
  name: 'Settings',
  options: {},
  dateCreated: timestamp,
  dateLastModified: timestamp,
  dateLastOpened: timestamp,
  host: 'ALL',
  files: files.map(f => f.id),
});

export const getSettingsSolutionAndFiles = (
  userSettings: Partial<ISettings> = {},
): {
  solution: ISolutionWithFileIds;
  files: IFile[];
} => {
  const now = Date.now();
  const files = getSettingsFiles(now, userSettings);
  const solution = getSettingsSolution(files, now);
  return { solution, files };
};

export const allowedSettings = {
  'editor.theme': ['dark', 'light', 'high-contrast'],
  'editor.fontFamily': ['Menlo', 'Consolas', 'Courier New', 'Source Code Pro'],
  'editor.wordWrap': ['bounded', 'on', 'off'],
  'editor.tabSize': [2, 4],
};

// Note: this must be kept in sync with the interfaces in src/interfaces/index.d.ts
export const schema = {
  $id: 'settings-schema.json',
  description: 'Schema for the settings of Script Lab',
  type: 'object',
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
  properties: {
    'editor.theme': {
      $id: '#/properties/editor.theme',
      type: 'string',
      default: defaultSettings['editor.theme'],
      enum: allowedSettings['editor.theme'],
    },
    'editor.fontFamily': {
      $id: '#/properties/editor.fontFamily',
      type: 'string',
      default: defaultSettings['editor.fontFamily'],
      enum: allowedSettings['editor.fontFamily'],
    },
    'editor.fontSize': {
      $id: '#/properties/editor.fontSize',
      type: 'integer',
      default: defaultSettings['editor.fontSize'],
      examples: [14, 16, 20],
    },
    'editor.minimap': {
      $id: '#/properties/editor.minimap',
      type: 'boolean',
      default: defaultSettings['editor.minimap'],
      examples: [false, true],
    },
    'editor.tabSize': {
      $id: '#/properties/editor.tabSize',
      type: 'integer',
      default: defaultSettings['editor.tabSize'],
      enum: allowedSettings['editor.tabSize'],
    },
    'editor.prettier': {
      $id: '#/properties/editor.prettier',
      type: 'boolean',
      default: defaultSettings['editor.prettier'],
      examples: [true, false],
    },
    'editor.prettier.autoFormat': {
      $id: '#/properties/editor.prettier.autoFormat',
      type: 'boolean',
      title: 'The Editor.prettier.autoformat Schema',
      default: defaultSettings['editor.prettier.autoFormat'],
      examples: [true, false],
    },
    'editor.folding': {
      $id: '#/properties/editor.folding',
      type: 'boolean',
      default: defaultSettings['editor.folding'],
      examples: [true, false],
    },
    'editor.wordWrap': {
      $id: '#/properties/editor.wordWrap',
      type: 'string',
      default: defaultSettings['editor.wordWrap'],
      enum: allowedSettings['editor.wordWrap'],
    },
  },
};
