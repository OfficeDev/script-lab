import isEqual from 'lodash/isEqual'

import { IState } from './reducer'
import selectors from './selectors'
import { convertSolutionToSnippet } from '../utils'
import { SETTINGS_SOLUTION_ID, NULL_SOLUTION_ID, localStorageKeys } from '../constants'
import { getSettingsSolutionAndFiles } from '../settings'
import { verifySettings } from './settings/sagas'
import { getBoilerplate } from '../newSolutionData'

const SOLUTION_ROOT = 'solution#'
let lastSavedState: IState

export const loadState = (): Partial<IState> => {
  try {
    // In order to fix the IE cross-tab issue (#147)
    localStorage.setItem('playground_dummy_key', 'null')

    let { solutions, files } = loadAllSolutionsAndFiles()

    const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}')
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
    const github = JSON.parse(localStorage.getItem('github') || '{}')

    return { solutions: { metadata: solutions, files }, settings: settingsState, github }
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
    // save solution
    writeIfChanged(
      selectors.editor.getActiveSolution,
      (solution: ISolution) => solution.id,
      state,
      lastSavedState,
      SOLUTION_ROOT,
    )

    // save github
    writeIfChanged(
      selectors.github.getProfilePicUrl,
      () => 'github-profile-pic-url',
      state,
      lastSavedState,
    )

    writeIfChanged(
      selectors.github.getToken,
      () => 'github-access-token',
      state,
      lastSavedState,
    )

    writeIfChanged(
      selectors.github.getUsername,
      () => 'github-username',
      state,
      lastSavedState,
    )

    // save settings
    writeIfChanged(
      selectors.settings.getUser,
      () => 'userSettings',
      state,
      lastSavedState,
    )

    const activeSolution = selectors.editor.getActiveSolution(state)
    if (
      activeSolution.id !== NULL_SOLUTION_ID &&
      activeSolution.id !== SETTINGS_SOLUTION_ID
    ) {
      // for new runner
      writeIfChanged(
        selectors.editor.getActiveSolution,
        () => 'activeSolution',
        state,
        lastSavedState,
      )
      // for old runner
      const activeSnippet = convertSolutionToSnippet(activeSolution)
      localStorage.setItem('activeSnippet', JSON.stringify(activeSnippet))
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

    // versions
    // if (
    //   LATEST_SOLUTION_VERSION_NUMBER !== CURRENT_SOLUTION_VERSION_NUMBER ||
    //   LATEST_SOLUTIONS_AND_FILES_VERSION_NUMBER !==
    //     CURRENT_SOLUTIONS_AND_FILES_VERSION_NUMBER
    // ) {
    //   selectors.solutions.getAll(state).map(solution => {
    //     writeItem(SOLUTION_ROOT, solution.id, solution)
    //   })

    //   localStorage.setItem(
    //     SOLUTIONS_AND_FILES_VERSION_KEY,
    //     LATEST_SOLUTIONS_AND_FILES_VERSION_NUMBER.toString(),
    //   )
    //   CURRENT_SOLUTIONS_AND_FILES_VERSION_NUMBER = LATEST_SOLUTIONS_AND_FILES_VERSION_NUMBER

    //   localStorage.setItem(
    //     SOLUTION_VERSION_KEY,
    //     LATEST_SOLUTION_VERSION_NUMBER.toString(),
    //   )
    //   CURRENT_SOLUTION_VERSION_NUMBER = LATEST_SOLUTION_VERSION_NUMBER
    // }

    lastSavedState = state
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
  let solutions: { [id: string]: ISolutionWithFileIds } = {}
  let files: { [id: string]: IFile } = {}

  // checking for newest storage format
  const solutionKeys = getAllLocalStorageKeys().filter(key =>
    key.startsWith(SOLUTION_ROOT),
  )
  if (solutionKeys.length > 0) {
    solutionKeys
      .map(key => key.replace(SOLUTION_ROOT, ''))
      .map(id => loadSolution(id))
      .forEach(solution => {
        // add files
        solution.files.forEach(file => {
          files[file.id] = file
        })
        // add solution with file-ids
        solutions[solution.id] = {
          ...solution,
          files: solution.files.map(({ id }) => id),
        }
      })
  } else {
    // No solutions detected in above format, attempting to look for legacy format
    console.log('trying to get legacy format!')
    // parsing for the load
    solutions = JSON.parse(localStorage.getItem('solutions') || '{}')
    files = JSON.parse(localStorage.getItem('files') || '{}')

    // normalizing solutions
    const defaults = getBoilerplate('')
    solutions = Object.keys(solutions)
      .map(key => solutions[key])
      .reduce(
        (newSolutions, solution) => ({
          ...newSolutions,
          [solution.id]: { ...defaults, ...solution },
        }),
        {},
      )

    // writing those back for subsequent loads
    Object.keys(solutions)
      .map(key => solutions[key])
      .map(solution => ({
        ...solution,
        files: solution.files.map(fileId => files[fileId]),
      }))
      .map(solution => writeItem(SOLUTION_ROOT, solution.id, solution))
  }

  return { solutions, files }
}

function loadSolution(id: string): ISolution {
  const solution = readItem(SOLUTION_ROOT, id)
  const defaults = getBoilerplate('')

  return { ...defaults, ...solution }
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

function writeIfChanged(
  selector: (state: IState) => any,
  getKey: (selectionResult: any) => string,
  currentState: IState,
  lastState: IState | undefined,
  root: string = '',
) {
  const current = selector(currentState)
  const last = lastState ? selector(lastState) : null
  if (current && (!last || !isEqual(current, last))) {
    writeItem(root, getKey(current), current)
  }
}

function writeItem(root: string, id: string, object: any) {
  localStorage.setItem(`${root}${id}`, JSON.stringify(object))
}

function readItem(root: string, id: string) {
  return JSON.parse(localStorage.getItem(`${root}${id}`) || 'null')
}
