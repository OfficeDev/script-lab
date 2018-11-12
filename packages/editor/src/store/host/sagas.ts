import { put, takeEvery, call, select } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';

import { host, gists, samples, editor } from '../actions';
import selectors from '../selectors';
import { openLastModifiedOrDefaultSolutionSaga } from '../solutions/sagas';
import { setupFabricTheme } from '../../theme';

export function* hostChangedSaga() {
  // whenever the host changes, we will check to see
  //    if there are any solutions, and if not, create a default

  yield call(openLastModifiedOrDefaultSolutionSaga);

  yield put(samples.fetchMetadata.request());
  yield put(gists.fetchMetadata.request());

  const host = yield select(selectors.host.get);
  setupFabricTheme(host);
}

export default function* hostWatcher() {
  yield takeEvery(getType(host.change), hostChangedSaga);
}
