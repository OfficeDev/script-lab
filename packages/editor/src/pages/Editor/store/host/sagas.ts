import { put, takeEvery, call, select } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';

import { host, gists, samples, editor } from '../actions';
import selectors from '../selectors';
import { openLastModifiedOrBackstageSaga } from '../solutions/sagas';
import { setupFabricTheme } from '../../../../theme';
import { PATHS } from '../../../../constants';

export default function* hostWatcher() {
  yield takeEvery(getType(host.change), hostChangedSaga);
}

export function* hostChangedSaga() {
  const host = yield select(selectors.host.get);
  setupFabricTheme(host);
  const { router } = yield select();
  if (router.location.pathname !== PATHS.EDITOR) {
    // For non-editor, don't need to do anything else
    return;
  }

  yield call(openLastModifiedOrBackstageSaga);

  yield put(samples.fetchMetadata.request());
  yield put(gists.fetchMetadata.request());
}
