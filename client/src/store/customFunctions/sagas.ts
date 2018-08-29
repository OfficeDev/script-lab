import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'

import { request } from '../../services/general'
import { customFunctions } from '../actions'
import selectors from '../selectors'

import { convertSolutionToSnippet } from '../../utils'
import { isCustomFunctionScript } from '../../utils/customFunctions'
import { registerMetadata } from '../../utils/customFunctions'

import { RUNNER_URL } from '../../constants'

export function* fetchCustomFunctionsMetadataSaga() {
  const solutions = yield select(selectors.solutions.getAll)

  const snippets = solutions
    .map(solution => {
      const script = solution.files.find(file => file.name === 'index.ts')
      return { solution, script }
    })
    .filter(({ script }) => isCustomFunctionScript(script.content))
    .map(({ solution }) => convertSolutionToSnippet(solution))

  const { content, error } = yield call(request, {
    method: 'POST',
    url: `${RUNNER_URL}/custom-functions/parse-metadata`,
    jsonPayload: JSON.stringify({ data: snippets }),
  })

  if (content) {
    yield put(customFunctions.fetchMetadata.success(content))
  } else {
    yield put(customFunctions.fetchMetadata.failure(error))
  }
}

function* registerCustomFunctionsMetadataSaga(
  action: ActionType<typeof customFunctions.registerMetadata.request>,
) {
  const { visual, code } = action.payload
  try {
    registerMetadata(visual, code)
    yield put(customFunctions.registerMetadata.success())
  } catch (error) {
    yield put(customFunctions.registerMetadata.failure(error))
  }
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
}
