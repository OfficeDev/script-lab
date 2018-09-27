import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import {
  settings as settingsActions,
  solutions as solutionsActions,
  editor as editorActions,
} from '../actions'

import { environmentName, editorUrls } from '../../environment'

import selectors from '../selectors'

import { allowedSettings } from '../../SettingsJSONSchema'

import { SETTINGS_SOLUTION_ID, SETTINGS_FILE_ID } from '../../constants'

// TODO: (nicobell) make it so that this thing throws when a nonaccepted value is used for setting
export const merge = (valid, parsed, allowed) =>
  Object.keys(valid)
    .map(setting => {
      if (parsed !== undefined && parsed[setting] !== undefined) {
        if (valid[setting] instanceof Object) {
          return [setting, merge(valid[setting], parsed[setting], allowed[setting])]
        } else if (allowed !== undefined && allowed[setting] !== undefined) {
          if (allowed[setting].includes(parsed[setting])) {
            return [setting, parsed[setting]]
          }
        } else {
          return [setting, parsed[setting]]
        }
      }

      return [setting, valid[setting]]
    })
    .reduce((acc, [key, value]) => ((acc[key] = value), acc), {})

function* editSettingsCheckSaga(action: ActionType<typeof solutionsActions.edit>) {
  if (
    action.payload.fileId === SETTINGS_FILE_ID &&
    action.payload.file &&
    action.payload.file.content
  ) {
    const { settings } = yield select()
    const { values } = settings

    try {
      const parsed = JSON.parse(action.payload.file.content)
      const newSettings = merge(values, parsed, allowedSettings)
      yield put(settingsActions.edit.success({ settings: newSettings }))
    } catch (e) {
      yield put(settingsActions.edit.failure(e))
    }
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
  yield takeEvery(getType(solutionsActions.edit), editSettingsCheckSaga)
  yield takeEvery(getType(settingsActions.edit.success), onSettingsEditSuccessSaga)
  yield takeEvery(getType(settingsActions.open), openSettingsSaga)
  yield takeEvery(getType(settingsActions.close), closeSettingsSaga)
}
