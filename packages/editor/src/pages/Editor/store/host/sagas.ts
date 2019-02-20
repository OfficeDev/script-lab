import { put, takeEvery, call } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';

import { host, gists, samples } from '../actions';
import { openLastOpenedOrBackstageSaga } from '../solutions/sagas';

export default function* hostWatcher() {
  yield takeEvery(getType(host.change), hostChangedSaga);
}

export function* hostChangedSaga() {
  yield call(openLastOpenedOrBackstageSaga);

  yield put(samples.fetchMetadata.request());
  yield put(gists.fetchMetadata.request());
}
