import { put, takeEvery, all } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import actions from '../actions'
import { getBoilerplateFiles, getBoilerplateSolution } from '../newSolutionData'

function* createSolution() {
  const files = getBoilerplateFiles()
  const solution = getBoilerplateSolution(files)

  yield put(actions.files.add(files))
  yield put(actions.solutions.add(solution))
  yield put(push(`/${solution.id}`))
}

export function* watchCreateSolution() {
  yield takeEvery('SOLUTIONS_CREATE', createSolution)
}
