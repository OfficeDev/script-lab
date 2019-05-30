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

export const invisibleDefaultSettings: { [key: string]: any } = {
  'jupyter.url': '',
  'jupyter.token': '',
  'jupyter.notebook': '',
  'jupyter.clearOnRegister': '',
  'experimental.customFunctions.allowRepeatingParameters': '',
};

export const allowedSettings = {
  'editor.theme': ['dark', 'light', 'high-contrast'],
  'editor.fontFamily': ['Menlo', 'Consolas', 'Courier New', 'Source Code Pro'],
  'editor.wordWrap': ['bounded', 'on', 'off'],
  'editor.tabSize': [2, 4],
};

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
