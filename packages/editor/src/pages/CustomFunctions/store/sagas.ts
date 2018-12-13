import { put, takeEvery, call, select } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';
import flatten from 'lodash/flatten';

import { request } from '../../../services/general';
import { customFunctions, solutions } from '../../../store/actions';
import selectors from '../../../store/selectors';

import { convertSolutionToSnippet } from '../../../utils';
import {
  getCustomFunctionEngineStatus,
  isCustomFunctionScript,
  getCustomFunctionsInfoForRegistration,
} from './utilities';
import { registerMetadata } from './utilities';

import {
  getCustomFunctionLogsFromLocalStorage,
  getIsCustomFunctionRunnerAlive,
  setCustomFunctionsLastRegisteredTimestamp,
} from 'common/lib/utilities/localStorage';

import { updateEngineStatus } from './actions';
import { push } from 'connected-react-router';
import { getLogsFromAsyncStorage } from './utilities/logs';

export default function* customFunctionsWatcher() {
  yield takeEvery(
    getType(customFunctions.fetchMetadata.request),
    fetchCustomFunctionsMetadataSaga,
  );
  yield takeEvery(
    getType(customFunctions.fetchMetadata.success),
    registerCustomFunctionsMetadataSaga,
  );

  yield takeEvery(getType(customFunctions.fetchLogs), fetchLogsSaga);

  yield takeEvery(getType(customFunctions.openDashboard), openDashboardSaga);

  yield takeEvery(getType(solutions.scriptNeedsParsing), checkIfIsCustomFunctionSaga);
}

export function* fetchCustomFunctionsMetadataSaga() {
  const solutions = yield select(selectors.customFunctions.getSolutions);

  const snippets = solutions.map(solution => convertSolutionToSnippet(solution));

  try {
    const cfInfo: { visual: ICFVisualMetadata; code: string } = yield call(
      getCustomFunctionsInfoForRegistration,
      snippets,
    );
    yield put(customFunctions.fetchMetadata.success(cfInfo));
  } catch (error) {
    console.error(`Failed to get custom function metadata: ${error}.`);
    yield put(customFunctions.fetchMetadata.failure(error));
  }
}

function* registerCustomFunctionsMetadataSaga(
  action: ActionType<typeof customFunctions.registerMetadata.request>,
) {
  const { visual, code } = action.payload;
  const allFunctions: ICFVisualFunctionMetadata[] = flatten(
    visual.snippets.map(snippet => snippet.functions),
  );

  try {
    yield call(registerMetadata, allFunctions, code);
    yield put(customFunctions.registerMetadata.success());

    const engineStatus = yield call(getCustomFunctionEngineStatus);
    yield put(updateEngineStatus(engineStatus));

    const timestamp = Date.now();
    yield put(customFunctions.updateRunner({ isAlive: true, lastUpdated: timestamp }));
    setCustomFunctionsLastRegisteredTimestamp(timestamp);
  } catch (error) {
    console.error(error);
    yield put(customFunctions.registerMetadata.failure(error));
  }
}

function* fetchLogsSaga() {
  const isUsingAsyncStorage: boolean = yield select(
    selectors.customFunctions.getIsUsingAsyncStorage,
  );

  const logs: ILogData[] = isUsingAsyncStorage
    ? yield call(getLogsFromAsyncStorage)
    : yield call(getCustomFunctionLogsFromLocalStorage);

  yield put(customFunctions.pushLogs(logs));
}

function* openDashboardSaga() {
  window.location.href = './custom-functions.html?backButton=true';
}

function* checkIfIsCustomFunctionSaga(
  action: ActionType<typeof solutions.scriptNeedsParsing>,
) {
  const { solution, file } = action.payload;

  const isCustomFunctionsSolution = isCustomFunctionScript(file.content);

  // Compare what is currently in the solution with what we want to update it to (via XOR)
  const optionsChanged =
    (!solution.options.isCustomFunctionsSolution && isCustomFunctionsSolution) ||
    (solution.options.isCustomFunctionsSolution && !isCustomFunctionsSolution);
  if (optionsChanged) {
    yield put(
      solutions.updateOptions({ solution, options: { isCustomFunctionsSolution } }),
    );
  }
}
