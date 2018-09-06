import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import { request } from '../../services/general'
import { customFunctions } from '../actions'
import selectors from '../selectors'

import { convertSolutionToSnippet } from '../../utils'
import { getCustomFunctionEngineStatus } from '../../utils/customFunctions'
import { registerMetadata } from '../../utils/customFunctions'

import { RUNNER_URL, PATHS } from '../../constants'
import {
  getCustomFunctionLogs,
  getCustomFunctionRunnerLastUpdated,
  getIsCustomFunctionRunnerAlive,
} from '../../store/localStorage'
import { fetchLogsAndHeartbeat, updateEngineStatus, openDashboard } from './actions'
import { push } from 'connected-react-router'
export function* fetchCustomFunctionsMetadataSaga() {
  const solutions = yield select(selectors.customFunctions.getSolutions)

  const snippets = solutions.map(solution => convertSolutionToSnippet(solution))

  const { response, error } = yield call(request, {
    method: 'POST',
    url: `${RUNNER_URL}/custom-functions/parse-metadata`,
    jsonPayload: JSON.stringify({ data: JSON.stringify({ snippets }) }),
  })
  console.log({ response, error })

  if (response) {
    yield put(customFunctions.fetchMetadata.success(response))
  } else {
    yield put(customFunctions.fetchMetadata.failure(error))
  }
}

function* registerCustomFunctionsMetadataSaga(
  action: ActionType<typeof customFunctions.registerMetadata.request>,
) {
  const { visual, code } = action.payload
  try {
    yield call(registerMetadata, visual, code)
    yield put(customFunctions.registerMetadata.success())

    const engineStatus = yield call(getCustomFunctionEngineStatus)
    yield put(updateEngineStatus(engineStatus))
  } catch (error) {
    yield put(customFunctions.registerMetadata.failure(error))
  }
}

function* fetchLogsAndHeartbeatSaga() {
  const logs = yield call(getCustomFunctionLogs)
  const lastUpdated = yield call(getCustomFunctionRunnerLastUpdated)
  const isAlive = yield call(getIsCustomFunctionRunnerAlive)
  if (logs) {
    yield put(customFunctions.pushLogs(logs))
  }
  yield put(customFunctions.updateRunner({ isAlive, lastUpdated }))
}

function* openDashboardSaga() {
  yield put(push(PATHS.CUSTOM_FUNCTIONS))
}

export default function* customFunctionsWatcher() {
  yield takeEvery(
    getType(customFunctions.fetchMetadata.request),
    fetchCustomFunctionsMetadataSaga,
  )
  yield takeEvery(
    getType(customFunctions.fetchMetadata.success),
    registerCustomFunctionsMetadataSaga,
  )

  yield takeEvery(
    getType(customFunctions.fetchLogsAndHeartbeat),
    fetchLogsAndHeartbeatSaga,
  )

  yield takeEvery(getType(customFunctions.openDashboard), openDashboardSaga)
}
