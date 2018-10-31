import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'
import { defaultRun, editor, solutions } from '../actions'
import selectors from '../selectors'
import { findAllNoUIFunctions } from './utilities'

export default function* defaultRunWatcher() {
  yield takeEvery(getType(defaultRun.fetchMetadata.request), fetchMetadataSaga)
  yield takeEvery(getType(editor.newSolutionOpened), fetchMetadataForSolutionSaga)
  yield takeEvery(getType(solutions.edit), fetchMetadataForSolutionSaga)
}

function* fetchMetadataSaga() {
  const solutions = yield select(selectors.solutions.getAll)

  const solutionNamesAndScripts = solutions.map(solution => ({
    name: solution.name,
    script: solution.files.find(file => file.name === 'index.ts'),
  }))

  // TODO:!!!
}

function* fetchMetadataForSolutionSaga(
  action: ActionType<typeof editor.newSolutionOpened> | ActionType<typeof solutions.edit>,
) {
  let solutionId
  switch (action.type) {
    case getType(editor.newSolutionOpened):
      solutionId = action.payload
      break
    case getType(solutions.edit):
      if (!action.payload.fileId) {
        return
      }
      const file: IFile = yield select(selectors.solutions.getFile, action.payload.fileId)
      if (file.language === 'typescript') {
        solutionId = action.payload.id
        break
      } else {
        return
      }
    default:
      throw new Error(`Unrecognized type.`)
  }

  const solution = yield select(selectors.solutions.get, solutionId)
  if (!solution) {
    return
  }

  const script = solution.files.find(file => file.name === 'index.ts')
  if (!script) {
    return
  }

  const noUIFunctionMetadata: IDefaultFunctionRunMetadata[] = findAllNoUIFunctions(
    script.content,
  ).map(
    name =>
      ({
        name,
        status: 'Idle',
      } as IDefaultFunctionRunMetadata),
  )
  yield put(defaultRun.updateActiveSolutionMetadata(noUIFunctionMetadata))
}