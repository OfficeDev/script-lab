import { put, takeEvery, all, call } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import actions from '../actions'

import { getBoilerplate } from '../newSolutionData'
import { getType } from 'typesafe-actions'

export function* createSolution(solution: ISolution, files: IFile[]) {
  yield put(actions.files.add(files))
  yield put(actions.solutions.add(solution))
  yield put(push(`/${solution.id}`))
}

function* createNewSolution() {
  const { solution, files } = getBoilerplate()
  yield call(createSolution, solution, files)
}

export function* watchCreateSolution() {
  yield takeEvery(getType(actions.solutions.create), createNewSolution)
}
