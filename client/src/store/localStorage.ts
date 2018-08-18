import { IState } from './reducer'
import selectors from './selectors'
import { convertSolutionToSnippet } from '../utils'
import { SETTINGS_SOLUTION_ID, SETTINGS_FILE_ID } from '../constants'
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

    const activeSolution = selectors.solutions.getActive(state)
    if (activeSolution && activeSolution.id !== SETTINGS_SOLUTION_ID) {
      const activeSnippet = convertSolutionToSnippet(activeSolution)
      localStorage.setItem('activeSnippet', JSON.stringify(activeSnippet))
    } else {
      localStorage.setItem('activeSnippet', 'null')
    }
  } catch (err) {
    // TODO
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
