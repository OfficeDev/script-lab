import { put, takeEvery } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import { editor } from '../actions'
import { push } from 'connected-react-router'
import { PATHS } from '../../constants'

export function* openSolutionSaga(action: ActionType<typeof editor.open>) {
  yield put(push(PATHS.EDITOR))
}

export function* hasLoadedSaga(action: ActionType<typeof editor.signalHasLoaded>) {
  const loadingIndicator = document.getElementById('loading')
  if (loadingIndicator) {
    const { parentNode } = loadingIndicator
    if (parentNode) {
      parentNode.removeChild(loadingIndicator)
    }
  }
}

export default function* editorWatcher() {
  yield takeEvery(getType(editor.open), openSolutionSaga)
  yield takeEvery(getType(editor.signalHasLoaded), hasLoadedSaga)
}
