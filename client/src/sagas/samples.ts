import { put, takeEvery, call } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import { samples, config } from '../actions'
import { fetchYaml } from '../services/general'
import { convertSnippetToSolution } from '../utils'
import { createSolutionSaga } from './solutions'

function* fetchDefaultSampleMetadataSaga() {}

function* fetchSampleMetadataSaga() {
  const platform = 'excel'
  const { content, error } = yield call(
    fetchYaml,
    `https://raw.githubusercontent.com/OfficeDev/office-js-snippets/master/playlists/${platform}.yaml`,
  )
  if (content) {
    yield put(samples.fetchMetadata.success(content))
  } else {
    yield put(samples.fetchMetadata.failure(error))
  }
}

function* openSampleSaga(action: ActionType<typeof samples.get.request>) {
  let url = action.payload.rawUrl
  url = url.replace('<ACCOUNT>', 'OfficeDev')
  url = url.replace('<REPO>', 'office-js-snippets')
  url = url.replace('<BRANCH>', 'master')

  const { content, error } = yield call(fetchYaml, url)
  if (content) {
    const { solution, files } = convertSnippetToSolution(content)
    yield put(samples.get.success({ solution, files }))
  } else {
    yield put(samples.get.failure(error))
  }
}

function* handleOpenSampleSuccessSaga(action: ActionType<typeof samples.get.success>) {
  yield call(createSolutionSaga, action.payload.solution, action.payload.files)
}

export function* sampleWatcher() {
  yield takeEvery(getType(samples.fetchMetadata.request), fetchSampleMetadataSaga)
  yield takeEvery(getType(config.changeHost), fetchSampleMetadataSaga)

  yield takeEvery(getType(samples.get.request), openSampleSaga)
  yield takeEvery(getType(samples.get.success), handleOpenSampleSuccessSaga)
}
