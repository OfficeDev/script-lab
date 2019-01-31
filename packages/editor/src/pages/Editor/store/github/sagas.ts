import { put, takeEvery, call, select } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';

import { github } from '../actions';
import { logout } from '../../services/github';
import { fetchAllGistMetadataSaga } from '../gists/sagas';
import selectors from '../selectors';

export default function* githubWatcher() {
  yield takeEvery(getType(github.login.success), fetchAllGistMetadataSaga);
  yield takeEvery(getType(github.logout.request), gitHubLogoutSaga);
}

function* gitHubLogoutSaga(action: ActionType<typeof github.logout.request>) {
  const token = yield select(selectors.github.getToken);
  yield call(logout, token);
  yield put(github.logout.success());
}
