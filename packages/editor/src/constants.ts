export const SETTINGS_SOLUTION_ID = 'user-settings';
export const USER_SETTINGS_FILE_ID = 'user-settings-file';
export const DEFAULT_SETTINGS_FILE_ID = 'default-settings-file';
export const SETTINGS_JSON_LANGUAGE = 'YAML';
export const ABOUT_FILE_ID = 'about';

export const NULL_FILE_ID = 'null-file';
export const NULL_FILE: IFile = {
  id: NULL_FILE_ID,
  name: '',
  content: '',
  language: '',
  dateCreated: 0,
  dateLastModified: 0,
  dateLastOpened: 0,
};

export const NULL_SOLUTION_ID = 'null-solution';
export const NULL_SOLUTION: ISolution = {
  id: NULL_SOLUTION_ID,
  name: '',
  host: 'ALL',
  dateCreated: 0,
  dateLastModified: 0,
  dateLastOpened: 0,
  options: {},
  files: [],
};

export const LIBRARIES_FILE_NAME = 'libraries.txt';
export const SCRIPT_FILE_NAME = 'index.ts';

export const READ_ONLY_FILE_IDS = [NULL_FILE_ID, ABOUT_FILE_ID, DEFAULT_SETTINGS_FILE_ID];

export const CUSTOM_FUNCTIONS_INFO_URL = 'https://aka.ms/customfunctions';

export const PATHS = {
  GITHUB_ISSUE: 'https://aka.ms/script-lab/issues',

  // Pages
  AddinCommands: '/functions',
  Auth: '/auth',
  CustomFunctions: '/custom-functions',
  CustomFunctionsHeartbeat: '/custom-functions-heartbeat',
  CustomFunctionsRun: '/custom-functions-run',
  Editor: '/',
  External: '/external-page',
  Heartbeat: '/heartbeat',
  Run: '/run',
};

export const IS_TASK_PANE_WIDTH = 475;

export const EDIT_FILE_DEBOUNCE_MS = 250;
export const EDIT_SETTINGS_DEBOUNCE_MS = 450;
