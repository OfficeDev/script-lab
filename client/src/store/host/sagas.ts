import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import { host, gists, samples, editor } from '../actions'
import selectors from '../selectors'
import { getDefaultSaga } from '../solutions/sagas'
import { setupFabricTheme } from '../../theme'

export function* hostChangedSaga() {
  // whenever the host changes, we will check to see
  //    if there are any solutions, and if not, create a default

  const solutions = yield select(selectors.solutions.getInLastModifiedOrder)

  if (solutions.length === 0) {
    yield call(getDefaultSaga)
  } else {
    yield put(
      editor.open({ solutionId: solutions[0].id, fileId: solutions[0].files[0].id }),
    )
  }

  yield put(samples.fetchMetadata.request())
  yield put(gists.fetchMetadata.request())

  const host = yield select(selectors.host.get)
  setupFabricTheme(host)
}

export default function* hostWatcher() {
  yield takeEvery(getType(host.change), hostChangedSaga)
}
