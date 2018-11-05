import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'
import { directScriptExecution, editor, solutions } from '../actions'
import selectors from '../selectors'
import { findAllNoUIFunctions, execute, terminateAll } from './utilities'

export default function* directScriptExecutionWatcher() {
  yield takeEvery(getType(directScriptExecution.fetchMetadata.request), fetchMetadataSaga)
  yield takeEvery(getType(editor.newSolutionOpened), fetchMetadataForSolutionSaga)
  yield takeEvery(getType(solutions.edit), fetchMetadataForSolutionSaga)
  yield takeEvery(
    getType(directScriptExecution.runFunction.request),
    directScriptExecutionFunctionSaga,
  )
  yield takeEvery(getType(directScriptExecution.terminateAll.request), terminateAllSaga)
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

  const noUIFunctionMetadata: string[] = yield call(findAllNoUIFunctions, script.content)

  const formattedMetadata = noUIFunctionMetadata.map(name => ({
    name,
    status: 'Idle' as 'Idle',
  }))

  yield put(directScriptExecution.updateActiveSolutionMetadata(formattedMetadata))
}

function* directScriptExecutionFunctionSaga(
  action: ActionType<typeof directScriptExecution.runFunction.request>,
) {
  const { solutionId, fileId, functionName } = action.payload
  const file: IFile = yield select(selectors.solutions.getFile, fileId)

  try {
    const result = yield call(
      execute,
      solutionId,
      file.content,
      functionName,
      file.dateLastModified,
    )
    yield put(directScriptExecution.runFunction.success({ functionName, result }))
  } catch (error) {
    yield put(directScriptExecution.runFunction.failure({ error, functionName }))
  }
}

function* terminateAllSaga() {
  yield call(terminateAll)
  yield put(directScriptExecution.terminateAll.success())
}
