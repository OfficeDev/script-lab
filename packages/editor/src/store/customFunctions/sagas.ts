import { put, takeEvery, call, select } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';

import { request } from '../../services/general';
import { customFunctions, solutions } from '../actions';
import selectors from '../selectors';

import { convertSolutionToSnippet } from '../../utils';
import {
  getCustomFunctionEngineStatus,
  isCustomFunctionScript,
} from '../../utils/customFunctions';
import { registerMetadata } from '../../utils/customFunctions';

import { RUNNER_URL, PATHS } from '../../constants';
import {
  getCustomFunctionLogs,
  getCustomFunctionRunnerLastUpdated,
  getIsCustomFunctionRunnerAlive,
} from '../../store/localStorage';
import { fetchLogsAndHeartbeat, updateEngineStatus, openDashboard } from './actions';
import { push } from 'connected-react-router';

export default function* customFunctionsWatcher() {
  // FIXME zlatkovsky
  // yield takeEvery(
  //   getType(customFunctions.fetchMetadata.request),
  //   fetchCustomFunctionsMetadataSaga,
  // );
  // yield takeEvery(
  //   getType(customFunctions.fetchMetadata.success),
  //   registerCustomFunctionsMetadataSaga,
  // );

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

  // FIXME zlatkovsky parse locally!
  const { response, error } = yield call(request, {
    method: 'POST',
    url: `${RUNNER_URL}/custom-functions/parse-metadata`,
    jsonPayload: JSON.stringify({ data: JSON.stringify({ snippets }) }),
  });

  if (response) {
    yield put(customFunctions.fetchMetadata.success(response));
  } else {
    yield put(customFunctions.fetchMetadata.failure(error));
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
  // Need to do a full-page navigation rather than a route navigation,
  // because Custom Functions need to load a different copy of the Office.js
  // script reference, and hence need a brand new page.
  window.location.href = '/custom-functions.html';
}

function* checkIfIsCustomFunctionSaga(
  action: ActionType<typeof solutions.scriptNeedsParsing>,
) {
  const { solution, file } = action.payload;

  const isCustomFunctionsSolution = isCustomFunctionScript(file.content);

  yield put(
    solutions.updateOptions({ solution, options: { isCustomFunctionsSolution } }),
  );
}
