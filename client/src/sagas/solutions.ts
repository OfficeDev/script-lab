import { put, takeEvery, call } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import { push } from 'connected-react-router'
import actions from '../actions'

import { getBoilerplate } from '../newSolutionData'

export function* createSolutionSaga(solution: ISolution, files: IFile[]) {
  yield put(actions.files.add(files))
  yield put(actions.solutions.add(solution))
  yield call(openSolutionSaga, solution)
}

export function* openSolutionSaga(solution: ISolution) {
  const { files } = solution
  if (files.length > 0) {
    yield put(push(`/${solution.id}/${files[0]}`))
  } else {
    yield put(push(`/${solution.id}/`))
  }
}

function* createNewSolutionSaga() {
  const { solution, files } = getBoilerplate()
  yield call(createSolutionSaga, solution, files)
}

export function* watchCreateSolution() {
  yield takeEvery(getType(actions.solutions.create), createNewSolutionSaga)
}
