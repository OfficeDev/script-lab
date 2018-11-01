import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import {
  settings as settingsActions,
  solutions as solutionsActions,
  editor as editorActions,
} from '../actions'

import selectors from '../selectors'

import isEqual from 'lodash/isEqual'

import { allowedSettings, defaultSettings } from '../../settings'

import {
  SETTINGS_SOLUTION_ID,
  USER_SETTINGS_FILE_ID,
  DEFAULT_SETTINGS_FILE_ID,
} from '../../constants'

export default function* settingsWatcher() {
  yield takeEvery(getType(settingsActions.editFile), editSettingsCheckSaga)
  yield takeEvery(getType(settingsActions.open), openSettingsSaga)
  yield takeEvery(getType(settingsActions.close), closeSettingsSaga)
  yield takeEvery(getType(settingsActions.cycleEditorTheme), cycleEditorThemeSaga)
}

export const verifySettings = parsed => {
  const validKeys = Object.keys(defaultSettings)
  const parsedKeys = Object.keys(parsed)
  const allowedValueKeys = Object.keys(allowedSettings)

  const invalidKeys = parsedKeys.filter(key => !validKeys.includes(key))
  if (invalidKeys.length > 0) {
    throw new Error(`Unrecognized keys: ${invalidKeys.join(', ')}`)
  }

  const newSettings = {}

  Object.keys(parsed).forEach(setting => {
    if (
      allowedValueKeys.includes(setting) &&
      !allowedSettings[setting].includes(parsed[setting])
    ) {
      /* In this case, there was a setting in parsed that wasn't in the list of allowed */
      throw new Error(`'${parsed[setting]}' is not an allowed value for '${setting}'.`)
    } else {
      newSettings[setting] = parsed[setting]
    }
  })

  return newSettings
}

function* editSettingsCheckSaga(action: ActionType<typeof settingsActions.editFile>) {
  if (action.payload.newSettings.trim() === '') {
    yield put(
      editorActions.open({
        solutionId: SETTINGS_SOLUTION_ID,
        fileId: DEFAULT_SETTINGS_FILE_ID,
      }),
    )
    return
  }

  try {
    const parsed = JSON.parse(action.payload.newSettings)

    const newSettings = verifySettings(parsed)

    const tabSize = { ...defaultSettings, ...newSettings }['editor.tabSize']

    const currentUserSettingsFile = yield select(
      selectors.solutions.getFile,
      USER_SETTINGS_FILE_ID,
    )
    currentUserSettingsFile.content = JSON.stringify(newSettings, null, tabSize)
    yield put(settingsActions.edit.success({ userSettings: newSettings }))
    yield put(
      solutionsActions.edit({
        id: SETTINGS_SOLUTION_ID,
        fileId: USER_SETTINGS_FILE_ID,
        file: currentUserSettingsFile,
      }),
    )
  } catch (e) {
    yield put(settingsActions.edit.failure(e))
  }
}

function* openSettingsSaga(action: ActionType<typeof settingsActions.open>) {
  const { editor } = yield select()
  const { active } = editor
  const { solutionId, fileId } = active

  if (solutionId !== SETTINGS_SOLUTION_ID) {
    yield put(settingsActions.setLastActive({ solutionId, fileId }))

    const userSettings = yield select(selectors.settings.getUser)
    const fileIdToOpen = isEqual(userSettings, {})
      ? DEFAULT_SETTINGS_FILE_ID
      : USER_SETTINGS_FILE_ID

    yield put(
      editorActions.open({
        solutionId: SETTINGS_SOLUTION_ID,
        fileId: fileIdToOpen,
      }),
    )
  }
}

function* closeSettingsSaga(action: ActionType<typeof settingsActions.close>) {
  const { settings } = yield select()
  const { lastActive } = settings
  const { solutionId, fileId } = lastActive
  yield put(editorActions.open({ solutionId, fileId }))
}

function* cycleEditorThemeSaga() {
  const settings = yield select(selectors.settings.get)
  const themes = allowedSettings['editor.theme']

  const currentTheme = settings['editor.theme']
  const currentThemeIndex = themes.indexOf(currentTheme)
  const nextThemeIndex = (currentThemeIndex + 1) % themes.length
  const nextTheme = themes[nextThemeIndex]

  const newUserSettings = yield select(selectors.settings.getUser)
  newUserSettings['editor.theme'] = nextTheme

  const tabSize = settings['editor.tabSize']

  yield put(
    settingsActions.editFile({
      newSettings: JSON.stringify(newUserSettings, null, tabSize),
    }),
  )
}
