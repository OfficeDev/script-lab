import { IState } from './reducer'
import selectors from './selectors'
import { convertSolutionToSnippet } from '../utils'
import { SETTINGS_SOLUTION_ID, SETTINGS_FILE_ID } from '../constants'
import { getSettingsSolutionAndFiles, defaultSettings } from '../defaultSettings'
import { merge } from './settings/sagas'
import { allowedSettings } from '../SettingsJSONSchema'
import { getAllLocalStorageKeys } from '../utils'
import isEqual from 'lodash/isEqual'

const SOLUTION_ROOT = 'solution'

let lastSavedState: IState

// helpers
const writeItem = (root: string, id: string, object: any) => {
  localStorage.setItem(`${root}${id}`, JSON.stringify(object))
}

const readItem = (root: string, id: string) =>
  JSON.parse(localStorage.getItem(`${root}${id}`) || 'null')

const writeIfChanged = (
  root: string,
  selector: (state: IState) => any,
  currentState: IState,
  lastState: IState | undefined,
) => {
  const current = selector(currentState)
  const last = lastState ? selector(lastState) : null
  if (current && (!last || !isEqual(current, last))) {
    writeItem(root, current.id, current)
  }
}

export const saveState = (state: IState) => {
  try {
    writeIfChanged(SOLUTION_ROOT, selectors.solutions.getActive, state, lastSavedState)

    const { github, settings } = state
    const serializedGithub = JSON.stringify(github)
    const serializedValidSettings = JSON.stringify(settings)

    localStorage.setItem('github', serializedGithub)
    localStorage.setItem('validSettings', serializedValidSettings)

    const activeSolution = selectors.solutions.getActive(state)
    if (activeSolution && activeSolution.id !== SETTINGS_SOLUTION_ID) {
      const activeSnippet = convertSolutionToSnippet(activeSolution)
      localStorage.setItem('activeSnippet', JSON.stringify(activeSnippet))
    } else {
      localStorage.setItem('activeSnippet', 'null')
    }

    lastSavedState = state
  } catch (err) {
    // TODO
    console.error(err)
  }
}

export const loadState = (): Partial<IState> => {
  try {
    let solutions = {}
    let files = {}

    getAllLocalStorageKeys()
      .filter(key => key.startsWith(SOLUTION_ROOT))
      .map(key => key.replace(SOLUTION_ROOT, ''))
      .map(id => readItem(SOLUTION_ROOT, id))
      .forEach(solution => {
        solution.files.forEach(file => {
          files[file.id] = file
        })
        solution.files = solution.files.map(({ id }) => id)
        solutions[solution.id] = solution
      })

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
