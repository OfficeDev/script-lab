import isEqual from 'lodash/isEqual';
import flatten from 'lodash/flatten';

import { IState as IGitHubState } from './github/reducer';
import { IState } from './reducer';
import selectors from './selectors';
import { convertSolutionToSnippet, convertSnippetToSolution } from '../utils';
import { SETTINGS_SOLUTION_ID, NULL_SOLUTION_ID, localStorageKeys } from '../constants';
import { getSettingsSolutionAndFiles } from '../settings';
import { verifySettings } from './settings/sagas';
import { getBoilerplate } from '../newSolutionData';
import { HostType } from '@microsoft/office-js-helpers';
import ensureFreshLocalStorage from 'common/lib/utilities/ensure.fresh.local.storage';
import { getProfilePicUrlAndUsername } from '../services/github';

interface IStoredGitHubState {
  token: string | null;
  profilePicUrl: string | null;
  username: string | null;
}

const GITHUB_KEY = 'github';
const SOLUTION_ROOT = 'solution#';
let lastSavedState: IState;

export async function loadState(): Promise<Partial<IState>> {
  try {
    ensureFreshLocalStorage();

    let { solutions, files } = loadAllSolutionsAndFiles();

    const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    const verifiedUserSettings = verifySettings(userSettings);
    const settingsSolAndFiles = getSettingsSolutionAndFiles(verifiedUserSettings);
    solutions = { ...solutions, [SETTINGS_SOLUTION_ID]: settingsSolAndFiles.solution };
    files = {
      ...files,
      ...settingsSolAndFiles.files.reduce(
        (all, file) => ({ ...all, [file.id]: file }),
        {},
      ),
    };

    const settingsState = {
      userSettings: verifiedUserSettings,
      lastActive: { solutionId: null, fileId: null },
    };

    const github = await loadGitHubInfo();

    return { solutions: { metadata: solutions, files }, settings: settingsState, github };
  } catch (err) {
    console.error(err);
    const settings = getSettingsSolutionAndFiles();

    return {
      solutions: {
        metadata: { [SETTINGS_SOLUTION_ID]: settings.solution },
        files: settings.files.reduce((all, file) => ({ ...all, [file.id]: file }), {}),
      },
    };
  }
}

export const saveState = (state: IState) => {
  // save solution
  if (selectors.editor.getActiveSolution(state).id !== NULL_SOLUTION_ID) {
    writeIfChanged(
      state => selectors.editor.getActiveSolution(state, { withHiddenFiles: true }),
      (solution: ISolution) => solution.id,
      state,
      lastSavedState,
      SOLUTION_ROOT,
    );
  }

  // save github
  writeIfChanged(
    (state: IState): IStoredGitHubState => ({
      profilePicUrl: selectors.github.getProfilePicUrl(state),
      username: selectors.github.getUsername(state),
      token: selectors.github.getToken(state),
    }),
    GITHUB_KEY,
    state,
    lastSavedState,
  );

  // save settings
  writeIfChanged(selectors.settings.getUser, 'userSettings', state, lastSavedState);

  const host = selectors.host.get(state);
  const activeSolution = selectors.editor.getActiveSolution(state, {
    withHiddenFiles: true,
  });
  if (isRealSolution(activeSolution)) {
    writeIfChanged(
      state => selectors.editor.getActiveSolution(state, { withHiddenFiles: true }),
      (solution: ISolution) => `activeSolution_${solution.host}`,
      state,
      lastSavedState,
    );
  } else {
    localStorage.setItem(`activeSolution_${host}`, 'null');
  }

  const cfPostData = getCFPostData(state);
  localStorage.setItem(
    localStorageKeys.customFunctionsRunPostData,
    JSON.stringify(cfPostData),
  );

  localStorage.setItem(
    localStorageKeys.customFunctionsLastUpdatedCodeTimestamp,
    selectors.customFunctions.getLastModifiedDate(state).toString(),
  );

  lastSavedState = state;
};

// github
async function loadGitHubInfo(): Promise<IGitHubState> {
  const githubInfo: string = localStorage.getItem(GITHUB_KEY);
  if (githubInfo) {
    return { ...JSON.parse(githubInfo), isLoggingInOrOut: false };
  }

  const tokenStorage = localStorage.getItem('OAuth2Tokens');
  if (tokenStorage) {
    const parsedTokenStorage = JSON.parse(tokenStorage);
    if (parsedTokenStorage && 'GitHub' in parsedTokenStorage) {
      const token = parsedTokenStorage.GitHub.access_token;
      if (token) {
        return {
          profilePicUrl: null,
          username: null,
          ...(await getProfilePicUrlAndUsername(token)),
          token,
          isLoggingInOrOut: false,
        };
      }
    }
  }
  return {
    profilePicUrl: null,
    username: null,
    token: null,
    isLoggingInOrOut: false,
  };
}

// solutions
export function deleteSolutionFromStorage(id: string) {
  deleteItem(SOLUTION_ROOT, id);
}

function loadAllSolutionsAndFiles(): {
  solutions: { [id: string]: ISolutionWithFileIds };
  files: { [id: string]: IFile };
} {
  let solutions: { [id: string]: ISolutionWithFileIds } = {};
  let files: { [id: string]: IFile } = {};

  // checking for newest storage format
  const solutionKeys = getAllLocalStorageKeys().filter(key =>
    key.startsWith(SOLUTION_ROOT),
  );
  if (solutionKeys.length > 0) {
    solutionKeys
      .map(key => key.replace(SOLUTION_ROOT, ''))
      .map(id => loadSolution(id))
      .forEach(solution => {
        // add files
        solution.files.forEach(file => {
          files[file.id] = file;
        });
        // add solution with file-ids
        solutions[solution.id] = {
          ...solution,
          files: solution.files.map(({ id }) => id),
        };
      });

    solutions = normalizeSolutions(solutions);
  } else {
    // No solutions detected in above format, attempting to look for older (circa Nov 2018) format
    // parsing for the load
    solutions = JSON.parse(localStorage.getItem('solutions') || '{}');
    files = JSON.parse(localStorage.getItem('files') || '{}');

    if (Object.keys(solutions).length === 0) {
      // the above format was not found
      // checking for Script Lab 2017 format snippets

      loadLegacyScriptLabSnippets().forEach(solution => {
        // add files
        solution.files.forEach(file => {
          files[file.id] = file;
        });
        // add solution with file-ids
        solutions[solution.id] = {
          ...solution,
          files: solution.files.map(({ id }) => id),
        };
      });
    }

    solutions = normalizeSolutions(solutions);

    // writing those back for subsequent loads
    Object.keys(solutions)
      .map(key => solutions[key])
      .map(solution => ({
        ...solution,
        files: solution.files.map(fileId => files[fileId]),
      }))
      .map(solution => writeItem(SOLUTION_ROOT, solution.id, solution));
  }

  // removing legacy format after successful write of the data in the new format
  localStorage.removeItem('solutions');
  localStorage.removeItem('files');

  // SL2017
  Object.keys(HostType)
    .map(key => HostType[key])
    .forEach(host => localStorage.removeItem(`playground_${host}_snippets`));

  ['playground_log', 'playground_settings', 'playground_trusted_snippets'].forEach(key =>
    localStorage.removeItem(key),
  );

  return { solutions, files };
}

function normalizeSolutions(solutions: {
  [id: string]: ISolutionWithFileIds;
}): { [id: string]: ISolutionWithFileIds } {
  const defaults = getBoilerplate('');
  return Object.keys(solutions)
    .filter(id => id !== NULL_SOLUTION_ID)
    .map(key => solutions[key])
    .reduce(
      (newSolutions, solution) => ({
        ...newSolutions,
        [solution.id]: { ...defaults, ...solution },
      }),
      {},
    );
}

function loadSolution(id: string): ISolution {
  const solution = readItem(SOLUTION_ROOT, id);
  const defaults = getBoilerplate('');

  return { ...defaults, ...solution };
}

function loadLegacyScriptLabSnippets(): ISolution[] {
  return flatten(
    Object.keys(HostType)
      .map(key => HostType[key])
      .map(host => {
        const snippets = JSON.parse(
          localStorage.getItem(`playground_${host}_snippets`) || '{}',
        );
        return Object.keys(snippets)
          .map(id => snippets[id])
          .map(snippet => convertSnippetToSolution(snippet));
      }),
  );
}

// custom functions
export const getIsCustomFunctionRunnerAlive = (): boolean => {
  ensureFreshLocalStorage();

  const lastHeartbeat = localStorage.getItem(
    localStorageKeys.customFunctionsLastHeartbeatTimestamp,
  );
  return lastHeartbeat ? +lastHeartbeat > 3000 : false;
};

export const getCustomFunctionCodeLastUpdated = (): number => {
  ensureFreshLocalStorage();

  const lastUpdated = localStorage.getItem(
    localStorageKeys.customFunctionsLastUpdatedCodeTimestamp,
  );
  return lastUpdated ? +lastUpdated : 0;
};

export const getCustomFunctionLogs = (): ILogData[] | null => {
  ensureFreshLocalStorage();

  const logsString = localStorage.getItem(localStorageKeys.log);

  if (logsString !== null) {
    localStorage.removeItem(localStorageKeys.log);

    return logsString
      .split('\n')
      .filter(line => line !== '')
      .filter(line => !line.includes('Agave.HostCall'))
      .map(entry => JSON.parse(entry) as ILogData);
  } else {
    return null;
  }
};

const getCFPostData = (state: IState): IRunnerCustomFunctionsPostData => {
  const cfSolutions = selectors.customFunctions.getSolutions(state);

  const snippets = cfSolutions.map(solution => {
    const snippet = convertSolutionToSnippet(solution);
    const { name, id, libraries, script } = snippet;

    return {
      name,
      id: solution.id,
      libraries: libraries || '',
      script: script ? script : { content: '', language: 'typescript' },
      metadata: undefined,
    };
  });

  const result = {
    snippets,
    loadFromOfficeJsPreviewCachedCopy: false,
    displayLanguage: 'en-us',
    heartbeatParams: {
      clientTimestamp: Date.now(),
      loadFromOfficeJsPreviewCachedCopy: false,
    },
    experimentationFlags: {},
  };

  return result;
};

// Helpers
function getAllLocalStorageKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      keys.push(key);
    }
  }
  return keys;
}

function isRealSolution(solution: ISolution) {
  return solution.id !== NULL_SOLUTION_ID && solution.id !== SETTINGS_SOLUTION_ID;
}

function writeIfChanged(
  selector: (state: IState) => any,
  getKey: ((selectionResult: any) => string) | string,
  currentState: IState,
  lastState: IState | undefined,
  root: string = '',
) {
  const current = selector(currentState);
  const last = lastState ? selector(lastState) : null;
  const key = typeof getKey === 'string' ? getKey : getKey(current);
  if (current && (!last || !isEqual(current, last))) {
    writeItem(root, key, current);
  }
}

function writeItem(root: string, id: string, object: any) {
  localStorage.setItem(`${root}${id}`, JSON.stringify(object));
}

function readItem(root: string, id: string) {
  return JSON.parse(localStorage.getItem(`${root}${id}`) || 'null');
}

function deleteItem(root: string, id: string) {
  localStorage.removeItem(`${root}${id}`);
}
