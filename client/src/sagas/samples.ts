import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import { samples, config } from '../actions'
import { getSampleMetadata, getSample } from '../services/github'
import { convertSnippetToSolution } from '../utils'
import { createSolution } from './solutions'
import { selectors } from '../reducers'

function* fetchSampleMetadataFlow() {
  const host = yield select(selectors.config.getHost)
  const { content, error } = yield call(getSampleMetadata, host)
  console.log({ content, error })
  if (content) {
    yield put(samples.fetchMetadata.success(content))
  } else {
    yield put(samples.fetchMetadata.failure(error))
  }
}

function* openSampleFlow(action) {
  const sampleJson = yield call(getSample, action.payload.rawUrl)

  const { solution, files } = convertSnippetToSolution(sampleJson)
  yield put(samples.get.success({ solution, files }))
}

function* handleOpenSampleSuccess(action) {
  yield call(createSolution, action.payload.solution, action.payload.files)
}

// TODO: theres gotta be a better way to do this
export function* sampleWatcher() {
  yield takeEvery(getType(samples.fetchMetadata.request), fetchSampleMetadataFlow)
  yield takeEvery(getType(config.changeHost), fetchSampleMetadataFlow)
  yield takeEvery(getType(samples.get.request), openSampleFlow)
  yield takeEvery(getType(samples.get.success), handleOpenSampleSuccess)
}
