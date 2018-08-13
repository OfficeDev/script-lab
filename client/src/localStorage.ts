import { getBoilerplate } from './newSolutionData'
import { selectors } from './reducers'
import { convertSolutionToSnippet } from './utils'
import { SETTINGS_SOLUTION_ID, SETTINGS_FILE_ID } from './constants'
import { getSettingsSolutionAndFiles, defaultSettings } from './defaultSettings'
import { merge } from './sagas/settings'
import { allowedSettings } from './SettingsJSONSchema'

const statifySolution = ({ solution, files }) => ({
  solutions: { byId: { [solution.id]: solution }, allIds: [solution.id] },
  files: {
    byId: files.reduce((byIdFiles, file) => ({ ...byIdFiles, [file.id]: file }), {}),
    allIds: files.map(file => file.id),
  },
})

export const loadState = () => {
  try {
    let solutions
    let files
    let github

    const serializedSolutions = localStorage.getItem('solutions')
    const serializedFiles = localStorage.getItem('files')
    const serializedGithub = localStorage.getItem('github')
    const serializedValidSettings = localStorage.getItem('validSettings')

    if (serializedSolutions === null || serializedFiles === null) {
      const state = statifySolution(getBoilerplate())
      solutions = state.solutions
      files = state.files
    } else {
      solutions = JSON.parse(serializedSolutions)
      files = JSON.parse(serializedFiles)
    }

    // inject settings if doesn't exist
    if (!solutions.allIds.includes(SETTINGS_SOLUTION_ID)) {
      const presetSettings =
        serializedValidSettings !== null
          ? JSON.parse(serializedValidSettings)
          : defaultSettings
      const settings = getSettingsSolutionAndFiles(presetSettings)
      solutions = {
        byId: { ...solutions.byId, [settings.solution.id]: settings.solution },
        allIds: [...solutions.byId, settings.solution.id],
      }
      files = {
        byId: settings.files.reduce(
          (acc, file) => ({ ...acc, [file.id]: file }),
          files.byId,
        ),
        allIds: [...files.allIds, ...settings.files.map(f => f.id)],
      }
    }

    // get initial settings
    const settingsFile = files.byId[SETTINGS_FILE_ID]
    const presetSettings = serializedValidSettings
      ? JSON.parse(serializedValidSettings)
      : defaultSettings

    let settings
    try {
      settings = merge(presetSettings, JSON.parse(settingsFile.content), allowedSettings)
    } catch (e) {
      settings = presetSettings
    }

    github = serializedGithub === null ? {} : JSON.parse(serializedGithub)

    return { solutions, files, github, settings }
  } catch (err) {
    return {
      ...statifySolution(getSettingsSolutionAndFiles()),
      github: {},
    }
  }
}

export const saveState = state => {
  try {
    const { solutions, files, github, settings } = state
    const serializedSolutions = JSON.stringify(solutions)
    const serializedFiles = JSON.stringify(files)
    const serializedGithub = JSON.stringify(github)
    const serializedValidSettings = JSON.stringify(settings)

    localStorage.setItem('solutions', serializedSolutions)
    localStorage.setItem('files', serializedFiles)
    localStorage.setItem('github', serializedGithub)
    localStorage.setItem('validSettings', serializedValidSettings)

    const activeSolution = selectors.active.solution(state)
    if (activeSolution.id !== SETTINGS_SOLUTION_ID) {
      const activeFiles = selectors.active.files(state)
      const activeSnippet = convertSolutionToSnippet(activeSolution, activeFiles)

      localStorage.setItem('activeSnippet', JSON.stringify(activeSnippet))
    } else {
      localStorage.setItem('activeSnippet', 'null')
    }
  } catch (err) {
    // TODO
  }
}
