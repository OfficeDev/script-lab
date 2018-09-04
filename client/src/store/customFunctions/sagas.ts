import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import { request } from '../../services/general'
import { customFunctions } from '../actions'
import selectors from '../selectors'

import { convertSolutionToSnippet } from '../../utils'
import {
  isCustomFunctionScript,
  getCustomFunctionEngineStatus,
} from '../../utils/customFunctions'
import { registerMetadata } from '../../utils/customFunctions'

import { RUNNER_URL } from '../../constants'
import {
  getCustomFunctionLogs,
  getCustomFunctionRunnerLastUpdated,
  getIsCustomFunctionRunnerAlive,
} from '../../store/localStorage'
import { fetchLogsAndHeartbeat, updateEngineStatus } from './actions'

export function* fetchCustomFunctionsMetadataSaga() {
  const solutions = yield select(selectors.solutions.getCustomFunctionSolutions)

  const snippets = solutions.map(solution => convertSolutionToSnippet(solution))

  const { response, error } = yield call(request, {
    method: 'POST',
    url: `${RUNNER_URL}/custom-functions/parse-metadata`,
    jsonPayload: JSON.stringify({ data: JSON.stringify({ snippets }) }),
  })
  console.log({ response, error })

  if (response) {
    console.log('going to put success for fetch metadata')
    yield put(customFunctions.fetchMetadata.success(response))
  } else {
    yield put(customFunctions.fetchMetadata.failure(error))
  }
}

function* registerCustomFunctionsMetadataSaga(
  action: ActionType<typeof customFunctions.registerMetadata.request>,
) {
  const { visual, code } = action.payload
  console.log('registering custom functions!')
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
}
