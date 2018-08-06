import { all, takeEvery } from 'redux-saga/effects'
import { watchCreateSolution } from './solutions'
import { sampleWatcher } from './samples'
import { gistWatcher } from './gists'
import { githubWatcher } from './github'
export default function* rootSaga() {
  yield all([watchCreateSolution(), sampleWatcher(), gistWatcher(), githubWatcher()])
}
