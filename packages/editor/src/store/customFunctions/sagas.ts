import { put, takeEvery, call, select } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';
import flatten from 'lodash/flatten';

import { request } from '../../services/general';
import { customFunctions, solutions } from '../actions';
import selectors from '../selectors';

import { convertSolutionToSnippet } from '../../utils';
import {
  getCustomFunctionEngineStatus,
  isCustomFunctionScript,
  getCustomFunctionsInfoForRegistration,
} from './utilities';
import { registerMetadata } from './utilities';

import {
  getCustomFunctionLogs,
  getCustomFunctionRunnerLastUpdated,
  getIsCustomFunctionRunnerAlive,
} from '../../store/localStorage';
import { fetchLogsAndHeartbeat, updateEngineStatus, openDashboard } from './actions';
import { push } from 'connected-react-router';

export default function* customFunctionsWatcher() {
  yield takeEvery(
    getType(customFunctions.fetchMetadata.request),
    fetchCustomFunctionsMetadataSaga,
  );
  yield takeEvery(
    getType(customFunctions.fetchMetadata.success),
    registerCustomFunctionsMetadataSaga,
  );

  yield takeEvery(
    getType(customFunctions.fetchLogsAndHeartbeat),
    fetchLogsAndHeartbeatSaga,
  );

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

    yield put(customFunctions.updateRunner({ isAlive: true, lastUpdated: Date.now() }));
  } catch (error) {
    console.error(error);
    yield put(customFunctions.registerMetadata.failure(error));
  }
}

function* fetchLogsAndHeartbeatSaga() {
  const logs = yield call(getCustomFunctionLogs);
  if (logs) {
    yield put(customFunctions.pushLogs(logs));
  }
}

function* fetchHeartbeatSaga() {
  const lastUpdated = yield call(getCustomFunctionRunnerLastUpdated);
  const isAlive = yield call(getIsCustomFunctionRunnerAlive);
  yield put(customFunctions.updateRunner({ isAlive, lastUpdated }));
}

function* openDashboardSaga() {
  window.location.href = './custom-functions.html';
}

function* checkIfIsCustomFunctionSaga(
  action: ActionType<typeof solutions.scriptNeedsParsing>,
) {
  const { solution, file } = action.payload;

  const isCustomFunctionsSolution = isCustomFunctionScript(file.content);
  if (!solution.options.isCustomFunctionsSolution && isCustomFunctionsSolution) {
    yield put(
      solutions.updateOptions({ solution, options: { isCustomFunctionsSolution } }),
    );
  }
}
