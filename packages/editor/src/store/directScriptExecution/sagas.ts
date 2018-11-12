import { put, takeEvery, call, select } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';
import { directScriptExecution, editor, solutions } from '../actions';
import selectors from '../selectors';
import { findAllNoUIFunctions, execute, terminateAll } from './utilities';
import { SCRIPT_FILE_NAME } from '../../constants';

export default function* directScriptExecutionWatcher() {
  yield takeEvery(
    getType(directScriptExecution.fetchMetadata.request),
    fetchMetadataSaga,
  );

  yield takeEvery(getType(solutions.scriptNeedsParsing), fetchMetadataForSolutionSaga);

  yield takeEvery(
    getType(directScriptExecution.runFunction.request),
    directScriptExecutionFunctionSaga,
  );
  yield takeEvery(getType(directScriptExecution.terminateAll.request), terminateAllSaga);
}

function* fetchMetadataSaga() {
  const solutions = yield select(selectors.solutions.getAll);

  const solutionNamesAndScripts = solutions.map(solution => ({
    name: solution.name,
    script: solution.files.find(file => file.name === SCRIPT_FILE_NAME),
  }));

  // TODO:!!!
}

function* fetchMetadataForSolutionSaga(
  action: ActionType<typeof solutions.scriptNeedsParsing>,
) {
  const { file } = action.payload;

  const noUIFunctionMetadata: string[] = yield call(findAllNoUIFunctions, file.content);

  const formattedMetadata = noUIFunctionMetadata.map(name => ({
    name,
    status: 'Idle' as 'Idle',
  }));

  yield put(directScriptExecution.updateActiveSolutionMetadata(formattedMetadata));
}

function* directScriptExecutionFunctionSaga(
  action: ActionType<typeof directScriptExecution.runFunction.request>,
) {
  const { solutionId, fileId, functionName } = action.payload;
  const file: IFile = yield select(selectors.solutions.getFile, fileId);

  try {
    const result = yield call(
      execute,
      solutionId,
      file.content,
      functionName,
      file.dateLastModified,
    );
    yield put(directScriptExecution.runFunction.success({ functionName, result }));
  } catch (error) {
    yield put(directScriptExecution.runFunction.failure({ error, functionName }));
  }
}

function* terminateAllSaga() {
  yield call(terminateAll);
  yield put(directScriptExecution.terminateAll.success());
}
