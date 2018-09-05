import { put, takeEvery } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import { editor } from '../actions'
import { push } from 'connected-react-router'
import { EDITOR_PATH } from '../../constants'

export function* openSolutionSaga(action: ActionType<typeof editor.open>) {
  yield put(push(EDITOR_PATH))
}

export default function* editorWatcher() {
  yield takeEvery(getType(editor.open), openSolutionSaga)
}
