import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { gists } from '../actions'
import { importGist, getGist, getAllGistMetadata } from '../services/github'
import { selectors } from '../reducers'
import { convertSnippetToSolution } from '../utils'
import { createSolution, openSolution, deleteSolution } from './solutions'
import YAML from 'yamljs'
import { push } from 'connected-react-router'
import { GistConflictResolutionOptions } from '../interfaces/enums'

function* importGistFlow(action) {
  let snippet
  if (action.payload.gistId) {
    snippet = yield call(importGist, action.payload.gistId)
  } else if (action.payload.gist) {
    snippet = YAML.parse(action.payload.gist)
  } else {
    throw new Error('Either a gistId or gist must be specified')
  }

  const { solution, files } = convertSnippetToSolution(snippet)
  yield put(gists.importPublic.success({ solution, files }))
}

function* handleImportGistSuccess(action) {
  yield call(createSolution, action.payload.solution, action.payload.files)
}

function* fetchGistMetadataFlow(action) {
  const state = yield select()
  const token = selectors.github.getToken(state)
  if (token) {
    const meta = yield call(getAllGistMetadata, token)
    yield put(gists.fetchMetadata.success(meta))
  }
}

function* getGistFlow(action) {
  const conflictResolutionType = action.payload.conflictResolution
    ? action.payload.conflictResolution.type
    : ''
  switch (conflictResolutionType) {
    case GistConflictResolutionOptions.Open:
      yield call(openSolution, action.payload.conflictResolution.existingSolution)
      break
    case GistConflictResolutionOptions.Overwrite:
      // delete the existing solution and files
      yield call(deleteSolution, action.payload.conflictResolution.existingSolution)
    case GistConflictResolutionOptions.CreateCopy:
    default:
      const snippet = yield call(getGist, action.payload.rawUrl)
      const { solution, files } = convertSnippetToSolution(snippet)
      solution.gistId = action.payload.gistId

      yield put(gists.get.success({ solution, files }))
  }
}

function* handleGetGistSuccess(action) {
  yield call(createSolution, action.payload.solution, action.payload.files)
}

// TODO: theres gotta be a better way to do this ... maybe not
export function* gistWatcher() {
  yield takeEvery(getType(gists.importPublic.request), importGistFlow)
  yield takeEvery(getType(gists.importPublic.success), handleImportGistSuccess)

  yield takeEvery(getType(gists.fetchMetadata.request), fetchGistMetadataFlow)

  yield takeEvery(getType(gists.get.request), getGistFlow)
  yield takeEvery(getType(gists.get.success), handleGetGistSuccess)
}
