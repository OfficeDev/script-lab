import { IState } from './reducer'
import selectors from './selectors'
import { convertSolutionToSnippet } from '../utils'
import {
  SETTINGS_SOLUTION_ID,
  SETTINGS_FILE_ID,
  NULL_SOLUTION_ID,
  localStorageKeys,
} from '../constants'
import { getSettingsSolutionAndFiles, defaultSettings } from '../defaultSettings'
import { merge } from './settings/sagas'
import { allowedSettings } from '../SettingsJSONSchema'

export const saveState = (state: IState) => {
  try {
    const { solutions, github, settings } = state
    const serializedSolutions = JSON.stringify(solutions.metadata)
    const serializedFiles = JSON.stringify(solutions.files)
    const serializedGithub = JSON.stringify(github)
    const serializedValidSettings = JSON.stringify(settings)

    localStorage.setItem('solutions', serializedSolutions)
    localStorage.setItem('files', serializedFiles)
    localStorage.setItem('github', serializedGithub)
    localStorage.setItem('validSettings', serializedValidSettings)

    const activeSolution = selectors.editor.getActiveSolution(state)
    if (
      activeSolution.id !== NULL_SOLUTION_ID &&
      activeSolution.id !== SETTINGS_SOLUTION_ID
    ) {
      const activeSnippet = convertSolutionToSnippet(activeSolution)
      localStorage.setItem('activeSnippet', JSON.stringify(activeSnippet))
    } else {
      localStorage.setItem('activeSnippet', 'null')
    }
  } catch (err) {
    // TODO
    console.error(err)
  }
}

export const loadState = (): Partial<IState> => {
  try {
    let solutions = JSON.parse(localStorage.getItem('solutions') || '{}')
    let files = JSON.parse(localStorage.getItem('files') || '{}')
    let settings = JSON.parse(localStorage.getItem('settings') || 'null')
    const github = JSON.parse(localStorage.getItem('github') || '{}')

    // inject settings if doesn't exist
    if (!Object.keys(solutions).includes(SETTINGS_SOLUTION_ID)) {
      const presetSettings = settings || defaultSettings
      const settingsSolAndFiles = getSettingsSolutionAndFiles(presetSettings)
      solutions = { ...solutions, [SETTINGS_SOLUTION_ID]: settingsSolAndFiles.solution }
      files = {
        ...files,
        ...settingsSolAndFiles.files.reduce(
          (all, file) => ({ ...all, [file.id]: file }),
          {},
        ),
      }
    }

    // get initial settings
    const settingsFile = files[SETTINGS_FILE_ID]
    const presetSettings = settings || defaultSettings

    try {
      settings = merge(presetSettings, JSON.parse(settingsFile.content), allowedSettings)
    } catch (e) {
      settings = presetSettings
    }

    return { solutions: { metadata: solutions, files }, github, settings }
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
  const lastHeartbeat = localStorage.getItem(
    localStorageKeys.customFunctionsLastHeartbeatTimestamp,
  )
  return lastHeartbeat ? +lastHeartbeat > 3000 : false
}

export const getCustomFunctionRunnerLastUpdated = (): number => {
  const lastUpdated = localStorage.getItem(
    localStorageKeys.customFunctionsLastUpdatedCodeTimestamp,
  )
  return lastUpdated ? +lastUpdated : 0
}

export const getCustomFunctionLogs = (): ILogData[] | null => {
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
