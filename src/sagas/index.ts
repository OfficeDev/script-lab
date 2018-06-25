import { all, takeEvery } from 'redux-saga/effects'
import { watchCreateSolution } from './solutions'
export default function* rootSaga() {
  yield all([watchCreateSolution()])
}
