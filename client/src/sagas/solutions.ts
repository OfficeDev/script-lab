import { put, takeEvery, all, call } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import actions from '../actions'

import { getBoilerplate } from '../newSolutionData'
import { getType } from 'typesafe-actions'
import solutions from '../reducers/solutions'

export function* createSolution(solution: ISolution, files: IFile[]) {
  yield put(actions.files.add(files))
  yield put(actions.solutions.add(solution))
  yield call(openSolution, solution)
}

export function* openSolution(solution: ISolution) {
  const { files } = solution
  if (files.length > 0) {
    yield put(push(`/${solution.id}/${files[0]}`))
  } else {
    yield put(push(`/${solution.id}/`))
  }
}

export function* deleteSolution(solution: ISolution) {
  yield put(actions.files.remove(solution.files))
  yield put(actions.solutions.remove(solution))
}

function* createNewSolution() {
  const { solution, files } = getBoilerplate()
  yield call(createSolution, solution, files)
}

export function* watchCreateSolution() {
  yield takeEvery(getType(actions.solutions.create), createNewSolution)
}
