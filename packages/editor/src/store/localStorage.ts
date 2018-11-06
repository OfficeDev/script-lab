import { IState } from './reducer'
import selectors from './selectors'
import { convertSolutionToSnippet } from '../utils'
import {
  SETTINGS_SOLUTION_ID,
  USER_SETTINGS_FILE_ID,
  NULL_SOLUTION_ID,
  localStorageKeys,
} from '../constants'
import {
  getSettingsSolutionAndFiles,
  defaultSettings,
  allowedSettings,
} from '../settings'
import { verifySettings } from './settings/sagas'

const SCRIPT_LAB_STORAGE_VERSION_KEY = 'storage_version'
const LATEST_SCRIPT_LAB_STORAGE_VERSION_NUMBER = 1
const CURRENT_SCRIPT_LAB_STORAGE_VERSION_NUMBER = JSON.parse(
  localStorage.getItem(SCRIPT_LAB_STORAGE_VERSION_KEY) || '0',
)

const SOLUTION_ROOT = 'solution'

export const loadState = (): Partial<IState> => {
  try {
    // In order to fix the IE cross-tab issue (#147)
    localStorage.setItem('playground_dummy_key', 'null')

    let { solutions, files } = loadAllSolutionsAndFiles()

    const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}')
    const github = JSON.parse(localStorage.getItem('github') || '{}')

    const verifiedUserSettings = verifySettings(userSettings)

    const settingsSolAndFiles = getSettingsSolutionAndFiles(verifiedUserSettings)
    solutions = { ...solutions, [SETTINGS_SOLUTION_ID]: settingsSolAndFiles.solution }
    files = {
      ...files,
      ...settingsSolAndFiles.files.reduce(
        (all, file) => ({ ...all, [file.id]: file }),
        {},
      ),
    }

    const settingsState = {
      userSettings: verifiedUserSettings,
      lastActive: { solutionId: null, fileId: null },
    }

    return { solutions: { metadata: solutions, files }, github, settings: settingsState }
  } catch (err) {
    const settings = getSettingsSolutionAndFiles()

    return {
      solutions: {
        metadata: { [SETTINGS_SOLUTION_ID]: settings.solution },
        files: settings.files.reduce((all, file) => ({ ...all, [file.id]: file }), {}),
      },
    }
  }
}

export const saveState = (state: IState) => {
  try {
    const { solutions, github } = state
    const { profilePicUrl, token } = github

    const userSettings = selectors.settings.getUser(state)

    const serializedGithub = JSON.stringify({ profilePicUrl, token })
    const serializedSolutions = JSON.stringify(solutions.metadata)
    const serializedFiles = JSON.stringify(solutions.files)
    const serializedUserSettings = JSON.stringify(userSettings)

    localStorage.setItem('solutions', serializedSolutions)
    localStorage.setItem('files', serializedFiles)
    localStorage.setItem('github', serializedGithub)
    localStorage.setItem('userSettings', serializedUserSettings)

    const activeSolution = selectors.editor.getActiveSolution(state)
    if (
      activeSolution.id !== NULL_SOLUTION_ID &&
      activeSolution.id !== SETTINGS_SOLUTION_ID
    ) {
      const activeSnippet = convertSolutionToSnippet(activeSolution)
      localStorage.setItem('activeSnippet', JSON.stringify(activeSnippet))
      localStorage.setItem('activeSolution', JSON.stringify(activeSolution))
    } else {
      localStorage.setItem('activeSnippet', 'null')
      localStorage.setItem('activeSolution', 'null')
    }

    const cfPostData = getCFPostData(state)
    localStorage.setItem(
      localStorageKeys.customFunctionsRunPostData,
      JSON.stringify(cfPostData),
    )

    localStorage.setItem(
      localStorageKeys.customFunctionsLastUpdatedCodeTimestamp,
      selectors.customFunctions.getLastModifiedDate(state).toString(),
    )
  } catch (err) {
    // TODO
    console.error(err)
  }
}

// solutions
function loadAllSolutionsAndFiles(): {
  solutions: { [id: string]: ISolutionWithFileIds }
  files: { [id: string]: IFile }
} {
  const solutions: { [id: string]: ISolutionWithFileIds } = {}
  const files: { [id: string]: IFile } = {}

  getAllLocalStorageKeys()
    .filter(key => key.startsWith(SOLUTION_ROOT))
    .map(key => key.replace(SOLUTION_ROOT, ''))
    .map(id => loadSolution(id))
    .forEach(solution => {
      solution.files.forEach(file => {
        files[file.id] = file
      })
      const solutionWithFileIds: ISolutionWithFileIds = (solutions[solution.id] = {
        ...solution,
        files: solution.files.map(({ id }) => id),
      })
    })

  return { solutions, files }
}

function loadSolution(id: string): ISolution {
  const solution = readItem(SOLUTION_ROOT, id)

  switch (CURRENT_SCRIPT_LAB_STORAGE_VERSION_NUMBER) {
    case 0:
      solution.options = {}
    default:
      break
  }

  return solution
}

// custom functions
export const getIsCustomFunctionRunnerAlive = (): boolean => {
  // In order to fix the IE cross-tab issue (#147)
  localStorage.setItem('playground_dummy_key', 'null')

  const lastHeartbeat = localStorage.getItem(
    localStorageKeys.customFunctionsLastHeartbeatTimestamp,
  )
  return lastHeartbeat ? +lastHeartbeat > 3000 : false
}

export const getCustomFunctionRunnerLastUpdated = (): number => {
  // In order to fix the IE cross-tab issue (#147)
  localStorage.setItem('playground_dummy_key', 'null')

  const lastUpdated = localStorage.getItem(
    localStorageKeys.customFunctionsLastUpdatedCodeTimestamp,
  )
  return lastUpdated ? +lastUpdated : 0
}

export const getCustomFunctionLogs = (): ILogData[] | null => {
  // In order to fix the IE cross-tab issue (#147)
  localStorage.setItem('playground_dummy_key', 'null')

  const logsString = localStorage.getItem(localStorageKeys.log)

  if (logsString !== null) {
    localStorage.removeItem(localStorageKeys.log)

    return logsString
      .split('\n')
      .filter(line => line !== '')
      .filter(line => !line.includes('Agave.HostCall'))
      .map(entry => JSON.parse(entry) as ILogData)
  } else {
    return null
  }
}

const getCFPostData = (state: IState): IRunnerCustomFunctionsPostData => {
  const cfSolutions = selectors.customFunctions.getSolutions(state)

  const snippets = cfSolutions.map(solution => {
    const snippet = convertSolutionToSnippet(solution)
    const { name, id, libraries, script } = snippet

    return {
      name,
      id,
      libraries,
      script,
      metadata: undefined,
    }
  })

  const result = {
    snippets,
    loadFromOfficeJsPreviewCachedCopy: false,
    displayLanguage: 'en-us',
    heartbeatParams: {
      clientTimestamp: Date.now(),
      loadFromOfficeJsPreviewCachedCopy: false,
    },
    experimentationFlags: {},
  }

  return result
}

// Helpers
function getAllLocalStorageKeys(): string[] {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      keys.push(key)
    }
  }
  return keys
}
function writeItem(root: string, id: string, object: any) {
  localStorage.setItem(`${root}${id}`, JSON.stringify(object))
}

function readItem(root: string, id: string) {
  return JSON.parse(localStorage.getItem(`${root}${id}`) || 'null')
}
