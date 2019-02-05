import { takeEvery, call } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';

import { github } from '../actions';
import { logout } from '../../services/github';
import { fetchAllGistMetadataSaga } from '../gists/sagas';

export default function* githubWatcher() {
  yield takeEvery(getType(github.loginSuccessful), fetchAllGistMetadataSaga);
  yield takeEvery(getType(github.logout), gitHubLogoutSaga);
}

function* gitHubLogoutSaga(_: ActionType<typeof github.logout>) {
  yield call(logout);
}
