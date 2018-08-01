import { put, takeEvery, call } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { github } from '../actions'
import { login } from '../services/github'
import { fetchGistMetadataFlow } from './gists'

function* githubLoginFlow(action) {
  const profile = yield call(login)

  yield put(github.login.success(profile))
}

export function* githubWatcher() {
  yield takeEvery(getType(github.login.request), githubLoginFlow)
  yield takeEvery(getType(github.login.success), fetchGistMetadataFlow)
}
