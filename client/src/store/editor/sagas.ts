import { put, takeEvery } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import { editor } from '../actions'
import { push } from 'connected-react-router'

export function* openSolutionSaga(action: ActionType<typeof editor.open>) {
  yield put(push('/'))
}

export default function* editorWatcher() {
  yield takeEvery(getType(editor.open), openSolutionSaga)
}
