import { all, takeEvery } from 'redux-saga/effects'
import { watchCreateSolution } from './solutions'
import { sampleWatcher } from './samples'
import { gistWatcher } from './gists'
export default function* rootSaga() {
  yield all([watchCreateSolution(), sampleWatcher(), gistWatcher()])
}
