import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import { settings as settingsActions, files } from '../actions'

import { allowedSettings } from '../SettingsJSONSchema'

import { SETTINGS_FILE_ID } from '../constants'

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

function* editSettingsCheckSaga(action: ActionType<typeof files.edit>) {
  if (action.payload.fileId === SETTINGS_FILE_ID && action.payload.file.content) {
    const state = yield select()
    const { settings } = state

    try {
      const parsed = JSON.parse(action.payload.file.content)
      const newSettings = merge(settings, parsed, allowedSettings)
      yield put(settingsActions.edit.success({ settings: newSettings }))
    } catch (e) {
      yield put(settingsActions.edit.failure(e))
    }
  }
}

export function* settingsWatcher() {
  yield takeEvery(getType(files.edit), editSettingsCheckSaga)
}
