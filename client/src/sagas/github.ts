import { put, takeEvery, call } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import { github } from '../actions'
import { login } from '../services/github'
import { fetchAllGistMetadataSaga } from './gists'

function* gitHubLoginSaga(action: ActionType<typeof github.login.request>) {
  const profile = yield call(login)

  yield put(github.login.success(profile))
}

export function* githubWatcher() {
  yield takeEvery(getType(github.login.request), gitHubLoginSaga)
  yield takeEvery(getType(github.login.success), fetchAllGistMetadataSaga)
}
