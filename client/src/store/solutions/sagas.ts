import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import { solutions, editor } from '../actions'
import { fetchYaml } from '../../services/general'
import selectors from '../selectors'
import { convertSnippetToSolution } from '../../utils'
import { getBoilerplate } from '../../newSolutionData'

export function* getDefaultSaga() {
  const host: string = yield select(selectors.host.get)
  const response = yield call(
    fetchYaml,
    `https://raw.githubusercontent.com/OfficeDev/office-js-snippets/master/samples/${host.toLowerCase()}/default.yaml`,
  )

  const { content, error } = response
  if (content) {
    const solution = convertSnippetToSolution(content)
    yield put(solutions.getDefault.success({ solution }))
  } else {
    yield put(solutions.getDefault.failure(error))
  }
}

function* handleGetDefaultSuccessSaga(
  action: ActionType<typeof solutions.getDefault.success>,
) {
  yield call(createSolutionSaga, action.payload.solution)
}

function* handleGetDefaultFailureSaga(
  action: ActionType<typeof solutions.getDefault.success>,
) {
  const host: string = yield select(selectors.host.get)
  const solution = getBoilerplate(host)
  yield call(createSolutionSaga, solution)
}

export function* createSolutionSaga(solution: ISolution) {
  yield put(solutions.add(solution))
  yield put(editor.open({ solutionId: solution.id, fileId: solution.files[0].id }))
}

export function* openLastModifiedOrDefaultSolutionSaga() {
  const solutions = yield select(selectors.solutions.getInLastModifiedOrder)

  if (solutions.length === 0) {
    yield call(getDefaultSaga)
  } else {
    yield put(
      editor.open({ solutionId: solutions[0].id, fileId: solutions[0].files[0].id }),
    )
  }
}

function* removeSolutionSaga(action: ActionType<typeof solutions.remove>) {
  yield call(openLastModifiedOrDefaultSolutionSaga)
}

export default function* solutionsWatcher() {
  yield takeEvery(getType(solutions.create), getDefaultSaga)
  yield takeEvery(getType(solutions.getDefault.success), handleGetDefaultSuccessSaga)
  yield takeEvery(getType(solutions.getDefault.failure), handleGetDefaultFailureSaga)

  yield takeEvery(getType(solutions.remove), removeSolutionSaga)
}
