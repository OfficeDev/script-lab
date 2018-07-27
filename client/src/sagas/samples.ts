import { put, takeEvery, call } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import { samples } from '../actions'
import { getSampleMetadata, getSample } from '../services/github'
import { convertSnippetToSolution } from '../utils'
import { createSolution } from './solutions'

function* fetchSampleMetadataFlow() {
  const sampleMetadata = yield call(getSampleMetadata)
  yield put(samples.fetchMetadata.success(sampleMetadata))
}

function* openSampleFlow(action) {
  const sampleJson = yield call(getSample, action.payload)

  const { solution, files } = convertSnippetToSolution(sampleJson)
  yield call(createSolution, solution, files)
}

// TODO: theres gotta be a better way to do this
export function* sampleWatcher() {
  yield takeEvery(getType(samples.fetchMetadata.request), fetchSampleMetadataFlow)
  yield takeEvery(getType(samples.get), openSampleFlow)
}
