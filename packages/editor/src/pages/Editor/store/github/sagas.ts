import { put, takeEvery, call, select } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';

import { github } from '../actions';
import { loginUsingDialogApi, logout } from '../../services/github';
import { fetchAllGistMetadataSaga } from '../gists/sagas';
import selectors from '../selectors';

export default function* githubWatcher() {
  yield takeEvery(getType(github.login.request), gitHubLoginSaga);
  yield takeEvery(getType(github.login.success), fetchAllGistMetadataSaga);
  yield takeEvery(getType(github.logout.request), gitHubLogoutSaga);
}

// FIXME this might be dead code.  Deaaaaaad.
function* gitHubLoginSaga(action: ActionType<typeof github.login.request>) {
  try {
    const profile = yield call(loginUsingDialogApi);

    yield put(github.login.success(profile));
  } catch (error) {
    yield put(github.login.failure(error));
  }
}

function* gitHubLogoutSaga(action: ActionType<typeof github.logout.request>) {
  const token = yield select(selectors.github.getToken);
  yield call(logout, token);
  yield put(github.logout.success());
}
