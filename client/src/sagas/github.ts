import { put, takeEvery, call } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { github } from '../actions'
import { login } from '../services/github'
import { convertSnippetToSolution } from '../utils'
import { createSolution } from './solutions'
import YAML from 'yamljs'

function* githubLoginFlow(action) {
  const profile = yield call(login)

  yield put(github.login.success(profile))
}

// TODO: theres gotta be a better way to do this ... maybe not
export function* githubWatcher() {
  yield takeEvery(getType(github.login.request), githubLoginFlow)
}
