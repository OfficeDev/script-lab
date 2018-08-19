import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import { host, gists, samples } from '../actions'
import selectors from '../selectors'
import { getDefaultSaga } from '../solutions/sagas'

export function* hostChangedSaga() {
  // whenever the host changes, we will check to see
  // if there are any solutions, and if not, create a default
  const solutions = yield select(selectors.solutions.getAll)

  if (solutions.length === 0) {
    yield call(getDefaultSaga)
  }

  yield put(samples.fetchMetadata.request())
  yield put(gists.fetchMetadata.request())
}

export default function* hostWatcher() {
  yield takeEvery(getType(host.change), hostChangedSaga)
}
