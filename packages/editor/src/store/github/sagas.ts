import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import { github } from '../actions'
import { login, logout } from '../../services/github'
import { fetchAllGistMetadataSaga } from '../gists/sagas'
import selectors from '../selectors'

function* gitHubLoginSaga(action: ActionType<typeof github.login.request>) {
  const profile = yield call(login)

  yield put(github.login.success(profile))
}

function* gitHubLogoutSaga(action: ActionType<typeof github.logout.request>) {
  const token = yield select(selectors.github.getToken)
  yield call(logout, token)
  yield put(github.logout.success())
}

export default function* githubWatcher() {
  yield takeEvery(getType(github.login.request), gitHubLoginSaga)
  yield takeEvery(getType(github.login.success), fetchAllGistMetadataSaga)
  yield takeEvery(getType(github.logout.request), gitHubLogoutSaga)
}
