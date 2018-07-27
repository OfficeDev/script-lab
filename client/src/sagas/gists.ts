import { put, takeEvery, call } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { gists } from '../actions'
import { getGist } from '../services/github'
import { convertSnippetToSolution } from '../utils'
import { createSolution } from './solutions'
import YAML from 'yamljs'

function* getGistFlow(action) {
  let snippet
  if (action.payload.gistId) {
    snippet = yield call(getGist, action.payload.gistId)
  } else if (action.payload.gist) {
    snippet = YAML.parse(action.payload.gist)
  } else {
    throw new Error('Either a gistId or gist must be specified')
  }

  const { solution, files } = convertSnippetToSolution(snippet)
  yield put(gists.get.success({ solution, files }))
}

function* handleGetGistSuccess(action) {
  yield call(createSolution, action.payload.solution, action.payload.files)
}

// TODO: theres gotta be a better way to do this ... maybe not
export function* gistWatcher() {
  yield takeEvery(getType(gists.get.request), getGistFlow)
  yield takeEvery(getType(gists.get.success), handleGetGistSuccess)
}
