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

export const loadState = (): Partial<IState> => {
  try {
    // In order to fix the IE cross-tab issue (#147)
    localStorage.setItem('playground_dummy_key', 'null')

    let solutions = JSON.parse(localStorage.getItem('solutions') || '{}')
    let files = JSON.parse(localStorage.getItem('files') || '{}')
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
