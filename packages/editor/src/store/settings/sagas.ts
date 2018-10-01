import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import {
  settings as settingsActions,
  solutions as solutionsActions,
  editor as editorActions,
} from '../actions'

import { environmentName, editorUrls } from '../../environment'

import { allowedSettings } from '../../SettingsJSONSchema'

import { SETTINGS_SOLUTION_ID, SETTINGS_FILE_ID } from '../../constants'

export const merge = (valid, parsed, allowed) => {
  if (valid instanceof Object) {
    const validKeys = Object.keys(valid)
    const parsedKeys = Object.keys(parsed)

    const invalidKeys = parsedKeys.filter(key => !validKeys.includes(key))
    if (invalidKeys.length > 0) {
      throw new Error(`Unrecognized keys: ${invalidKeys.join(', ')}`)
    }
  }

  return Object.keys(valid)
    .map(setting => {
      if (parsed && parsed[setting]) {
        /* if there is more settings to compare inside the valid schema
           then recursively call merge */
        if (valid[setting] instanceof Object) {
          return [setting, merge(valid[setting], parsed[setting], allowed[setting])]

          /* if we've reached a value, check to see if there are a list of allowed values */
        } else if (allowed && allowed[setting]) {
          if (allowed[setting].includes(parsed[setting])) {
            return [setting, parsed[setting]]
          } else {
            /* In this case, there was a setting in parsed that wasn't in the list of allowed */
            throw new Error(
              `'${parsed[setting]}' is not an allowed value for '${setting}'.`,
            )
          }
        } else {
          return [setting, parsed[setting]]
        }
      }

      return [setting, valid[setting]]
    })
    .reduce((acc, [key, value]) => ((acc[key] = value), acc), {})
}

function* editSettingsCheckSaga(action: ActionType<typeof settingsActions.editFile>) {
  const { settings } = yield select()
  const { values } = settings

  try {
    const parsed = JSON.parse(action.payload.newSettings.content)
    const newSettings = merge(values, parsed, allowedSettings)
    yield put(settingsActions.edit.success({ settings: newSettings }))
    yield put(
      solutionsActions.edit({
        id: SETTINGS_SOLUTION_ID,
        fileId: SETTINGS_FILE_ID,
        file: action.payload.newSettings,
      }),
    )
  } catch (e) {
    yield put(settingsActions.edit.failure(e))
  }
}

function* onSettingsEditSuccessSaga(
  action: ActionType<typeof settingsActions.edit.success>,
) {
  const { settings } = action.payload

  const newEnvironment = settings.environment
  if (newEnvironment !== environmentName) {
    window.location.href = `${
      editorUrls.production
    }?targetEnvironment=${encodeURIComponent(editorUrls[newEnvironment])}`
  }
}

function* openSettingsSaga(action: ActionType<typeof settingsActions.open>) {
  const { editor } = yield select()
  const { active } = editor
  const { solutionId, fileId } = active
  yield put(settingsActions.setLastActive({ solutionId, fileId }))

  yield put(
    editorActions.open({ solutionId: SETTINGS_SOLUTION_ID, fileId: SETTINGS_FILE_ID }),
  )
}

function* closeSettingsSaga(action: ActionType<typeof settingsActions.close>) {
  const { settings } = yield select()
  const { lastActive } = settings
  const { solutionId, fileId } = lastActive
  yield put(editorActions.open({ solutionId, fileId }))
}

export default function* settingsWatcher() {
  yield takeEvery(getType(settingsActions.editFile), editSettingsCheckSaga)
  yield takeEvery(getType(settingsActions.edit.success), onSettingsEditSuccessSaga)
  yield takeEvery(getType(settingsActions.open), openSettingsSaga)
  yield takeEvery(getType(settingsActions.close), closeSettingsSaga)
}
