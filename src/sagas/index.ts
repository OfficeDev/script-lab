import { all, takeEvery } from 'redux-saga/effects'
import { watchCreateSolution } from './solutions'
import { sampleWatcher } from './samples'
export default function* rootSaga() {
  yield all([watchCreateSolution(), sampleWatcher()])
}
