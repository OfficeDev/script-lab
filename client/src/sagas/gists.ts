import { put, takeEvery, call, select } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'
import YAML from 'yamljs'

import * as github from '../services/github'
import { fetchYaml } from '../services/general'
import { gists, solutions } from '../actions'
import { selectors } from '../reducers'

import { convertSnippetToSolution, convertSolutionToSnippet } from '../utils'
import { ConflictResolutionOptions } from '../interfaces/enums'

import { createSolutionSaga, openSolutionSaga } from './solutions'

export function* fetchAllGistMetadataSaga() {
  const token = yield select(selectors.github.getToken)
  if (token) {
    const { response, error } = yield call(github.request, {
      method: 'GET',
      path: 'gists',
      token,
    })

    if (response) {
      const gistsMetadata = response.map(gist => {
        const { files, id, description, updated_at, created_at } = gist
        const file = files[Object.keys(files)[0]]
        const title = file.filename.split('.')[0]
        const url = file.raw_url

        return {
          url,
          id,
          description,
          title,
          dateCreated: created_at,
          dateLastModified: updated_at,
        }
      })
      yield put(gists.fetchMetadata.success(gistsMetadata))
    } else {
      yield put(gists.fetchMetadata.failure(error))
    }
  }
}

function* getGistSaga(action: ActionType<typeof gists.get.request>) {
  if (action.payload.conflictResolution) {
    switch (action.payload.conflictResolution.type) {
      case ConflictResolutionOptions.Open:
        yield call(openSolutionSaga, action.payload.conflictResolution.existingSolution)
        return

      case ConflictResolutionOptions.Overwrite:
        // delete the existing solution and files
        yield put(solutions.remove(action.payload.conflictResolution.existingSolution))
        yield call(openGistHelper, action.payload.rawUrl, action.payload.gistId)
        return

      case ConflictResolutionOptions.CreateCopy:
        yield call(openGistHelper, action.payload.rawUrl, action.payload.gistId)
        return

      default:
        throw new Error(`Unknown option ${action.payload.conflictResolution.type}`)
    }
  } else {
    yield call(openGistHelper, action.payload.rawUrl, action.payload.gistId)
  }
}

function* openGistHelper(rawUrl: string, gistId: string) {
  const { content, error } = yield call(fetchYaml, rawUrl)
  if (content) {
    const { solution, files } = convertSnippetToSolution(content)
    solution.source = {
      id: gistId,
      origin: 'gist',
    }
    yield put(gists.get.success({ solution, files }))
  } else {
    yield put(gists.get.failure(error))
  }
}

function* handleGetGistSuccessSaga(action: ActionType<typeof gists.get.success>) {
  yield call(createSolutionSaga, action.payload.solution, action.payload.files)
}

function* createGistSaga(action: ActionType<typeof gists.create.request>) {
  const token = yield select(selectors.github.getToken)
  if (token) {
    const solution: ISolution = yield select(
      selectors.solutions.get,
      action.payload.solutionId,
    )
    const files: IFile[] = yield select(selectors.files.getMany, solution.files)

    const snippet = YAML.stringify(convertSolutionToSnippet(solution, files))

    const { response, error } = yield call(github.request, {
      method: 'POST',
      path: 'gists',
      token,
      jsonPayload: JSON.stringify({
        public: action.payload.isPublic,
        description: `${solution.description}`,
        files: {
          [`${solution.name}.yaml`]: {
            content: snippet,
          },
        },
      }),
    })

    if (response) {
      yield put(gists.create.success({ gist: response, solution }))
    } else {
      yield put(gists.create.failure(error))
    }
  }
}

function* handleCreateGistSuccessSaga(action: ActionType<typeof gists.create.success>) {
  const { solution } = action.payload
  solution.source = { id: action.payload.gist.id, origin: 'gist' }
  yield put(solutions.edit(solution.id, solution))
}

function* updateGistSaga(action: ActionType<typeof gists.update.request>) {
  const token = yield select(selectors.github.getToken)
  if (token) {
    const solution = yield select(selectors.solutions.get, action.payload.solutionId)
    const files = yield select(selectors.files.getMany, solution.files)

    const snippet = YAML.stringify(convertSolutionToSnippet(solution, files))
    const gistId = solution.source.id

    if (!gistId) {
      yield put(gists.update.failure(new Error('No gistId for this solution.')))
    } else {
      const { response, error } = yield call(github.request, {
        method: 'PATCH',
        path: `gists/${gistId}`,
        token,
        jsonPayload: JSON.stringify({
          description: `${solution.description}`,
          files: {
            [`${solution.name}.yaml`]: {
              content: snippet,
            },
          },
        }),
      })

      if (response) {
        yield put(gists.update.success({ gist: response }))
      } else {
        yield put(gists.update.failure(error))
      }
    }
  }
}

function* importSnippetSaga(action: ActionType<typeof gists.importSnippet.request>) {
  try {
    if (action.payload.gistId) {
      const { response, error } = yield call(github.request, {
        method: 'GET',
        path: `gists/${action.payload.gistId}`,
      })
      if (response) {
        const gistFiles = response.files
        const snippet = YAML.parse(gistFiles[Object.keys(gistFiles)[0]].content)
        const { solution, files } = convertSnippetToSolution(snippet)
        yield put(gists.importSnippet.success({ solution, files }))
      } else {
        throw error
      }
    } else if (action.payload.gist) {
      const snippet = YAML.parse(action.payload.gist)
      const { solution, files } = convertSnippetToSolution(snippet)
      yield put(gists.importSnippet.success({ solution, files }))
    } else {
      throw new Error('Either a gistId or gist must be specified')
    }
  } catch (e) {
    yield put(gists.importSnippet.failure(e))
  }
}

function* handleImportSnippetSuccessSaga(
  action: ActionType<typeof gists.importSnippet.success>,
) {
  yield call(createSolutionSaga, action.payload.solution, action.payload.files)
}

export function* gistWatcher() {
  yield takeEvery(getType(gists.fetchMetadata.request), fetchAllGistMetadataSaga)

  yield takeEvery(getType(gists.get.request), getGistSaga)
  yield takeEvery(getType(gists.get.success), handleGetGistSuccessSaga)

  yield takeEvery(getType(gists.create.request), createGistSaga)
  yield takeEvery(getType(gists.create.success), handleCreateGistSuccessSaga)

  yield takeEvery(getType(gists.update.request), updateGistSaga)

  yield takeEvery(getType(gists.importSnippet.request), importSnippetSaga)
  yield takeEvery(getType(gists.importSnippet.success), handleImportSnippetSuccessSaga)
}
