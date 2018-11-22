import { put, takeEvery, call, select } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';

import { host, gists, samples } from '../actions';
import selectors from '../selectors';
import { openLastModifiedOrDefaultSolutionSaga } from '../solutions/sagas';
import { setupFabricTheme } from '../../theme';
import { PATHS } from '../../constants';

export default function* hostWatcher() {
  yield takeEvery(getType(host.change), hostChangedSaga);
}

export function* hostChangedSaga() {
  const host = yield select(selectors.host.get);
  setupFabricTheme(host);

  const { router } = yield select();
  if (router.location.pathname === PATHS.CUSTOM_FUNCTIONS) {
    // For custom functions dashboard, don't need to do anything else
    return;
  }

  // whenever the host changes, we will check to see
  //    if there are any solutions, and if not, create a default

  yield call(openLastModifiedOrDefaultSolutionSaga);

  yield put(samples.fetchMetadata.request());
  yield put(gists.fetchMetadata.request());
}
