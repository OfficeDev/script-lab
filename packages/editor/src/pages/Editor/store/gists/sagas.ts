import { put, takeEvery, call, select } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';
import YAML from 'js-yaml';

import * as github from '../../services/github';
import { fetchYaml, IResponseOrError } from '../../services/general';
import { gists, editor, solutions } from '../actions';
import selectors from '../selectors';

import { convertSnippetToSolution, convertSolutionToSnippet } from '../../../../utils';
import { ConflictResolutionOptions } from '../../../../interfaces/enums';

import { createSolutionSaga } from '../solutions/sagas';
import { checkForUnsupportedAPIsIfRelevant } from './utilities';

export default function* gistsWatcher() {
  yield takeEvery(getType(gists.fetchMetadata.request), fetchAllGistMetadataSaga);
  yield takeEvery(getType(gists.fetchMetadata.success), onFetchGistMetadataSuccessSaga);
  yield takeEvery(getType(gists.fetchMetadata.failure), onFetchGistMetadataFailureSaga);

  yield takeEvery(getType(gists.get.request), getGistSaga);
  yield takeEvery(getType(gists.get.success), handleGetGistSuccessSaga);

  yield takeEvery(getType(gists.create.request), createGistSaga);
  yield takeEvery(getType(gists.create.success), handleCreateGistSuccessSaga);
  yield takeEvery(getType(gists.create.success), fetchAllGistMetadataSaga);

  yield takeEvery(getType(gists.update.request), updateGistSaga);

  yield takeEvery(getType(gists.importSnippet.request), importSnippetSaga);
  yield takeEvery(getType(gists.importSnippet.success), handleImportSnippetSuccessSaga);
}

export function* fetchAllGistMetadataSaga() {
  const token = yield select(selectors.github.getToken);
  if (!token) {
    return;
  }

  const currentHost = yield select(selectors.host.get);

  const {
    response,
    error,
  }: IResponseOrError<
    Array<{
      files: Array<{ filename: string }>;
      id: string;
      description: string;
      public: boolean;
    }>
  > = yield call(github.request, {
    method: 'GET',
    path: 'gists?per_page=100',
    token,
    isArrayResponse: true,
  });

  if (response) {
    const gistsMetadata = response
      .filter(
        ({ files }) =>
          Object.keys(files).length === 1 &&
          /^(.*)\.yaml$/.test(files[Object.keys(files)[0]].filename),
      )
      .map(gist => {
        const { files, id, description } = gist;
        const file: { filename: string; raw_url: string } = files[Object.keys(files)[0]];

        const result = /^(.*)\.(EXCEL|WORD|POWERPOINT|ACCESS|PROJECT|OUTLOOK|ONENOTE|WEB)\.yaml$/.exec(
          file.filename,
        );

        const { title, host } =
          result !== null
            ? { title: result[1], host: result[2] }
            : { title: file.filename.replace('.yaml', ''), host: currentHost };
        // in the else case of the condition above, it is a legacy Script Lab gist that wasn't saved with a host,
        // so it is assuming it is for the current host so that it will be visible

        const url = file.raw_url;

        return {
          url,
          host,
          id,
          description,
          title,
          isPublic: gist.public,
        };
      });

    yield put(gists.fetchMetadata.success(gistsMetadata));
  } else {
    yield put(
      gists.fetchMetadata.failure({ shouldLogUserOut: error.message === 'Unauthorized' }),
    );
  }
}

function* onFetchGistMetadataSuccessSaga(
  action: ActionType<typeof gists.fetchMetadata.success>,
) {
  /* This saga gets executed whenever fetchGistMetadata.success is dispatched
     The code below goes through the resulting metadata and ensures that no local
     solution is still pointing to a non-existing gist. */
  const metadataIds = action.payload.map(metadata => metadata.id);
  const allSolutions: ISolution[] = yield select(selectors.solutions.getAll);

  const solutionsToClean = allSolutions.filter(
    solution => solution.source && !metadataIds.includes(solution.source.id),
  );

  for (const solution of solutionsToClean) {
    yield put(solutions.edit({ id: solution.id, solution: { source: undefined } }));
  }
}

function* onFetchGistMetadataFailureSaga(
  action: ActionType<typeof gists.fetchMetadata.failure>,
) {
  if (action.payload.shouldLogUserOut) {
    github.logout();
  }
}

function* getGistSaga(action: ActionType<typeof gists.get.request>) {
  if (action.payload.conflictResolution) {
    switch (action.payload.conflictResolution.type) {
      case ConflictResolutionOptions.Open:
        const solution = action.payload.conflictResolution.existingSolution;
        yield put(
          editor.openFile({ solutionId: solution.id, fileId: solution.files[0].id }),
        );
        return;

      case ConflictResolutionOptions.Overwrite:
        // delete the existing solution and files
        yield put(solutions.remove(action.payload.conflictResolution.existingSolution));
        yield call(openGistHelper, action.payload.rawUrl, action.payload.gistId);
        return;

      case ConflictResolutionOptions.CreateCopy:
        yield call(openGistHelper, action.payload.rawUrl, action.payload.gistId);
        return;

      default:
        throw new Error(`Unknown option ${action.payload.conflictResolution.type}`);
    }
  } else {
    yield call(openGistHelper, action.payload.rawUrl, action.payload.gistId);
  }
}

function* openGistHelper(rawUrl: string, gistId: string) {
  const { content, error } = yield call(fetchYaml, rawUrl);
  if (content) {
    const solution = convertSnippetToSolution(content);
    solution.source = {
      id: gistId,
      origin: 'gist',
    };
    yield put(gists.get.success({ solution }));
  } else {
    yield put(gists.get.failure(error));
  }
}

function* handleGetGistSuccessSaga(action: ActionType<typeof gists.get.success>) {
  yield call(createSolutionSaga, action.payload.solution);
}

function* createGistSaga(action: ActionType<typeof gists.create.request>) {
  const token = yield select(selectors.github.getToken);
  if (!token) {
    return;
  }

  const solution: ISolution = yield select(
    selectors.solutions.get,
    action.payload.solutionId,
  );

  const snippet = YAML.safeDump(convertSolutionToSnippet(solution));

  const { response, error } = yield call(github.request, {
    method: 'POST',
    path: 'gists',
    isArrayResponse: false,
    token,
    jsonPayload: JSON.stringify({
      public: action.payload.isPublic,
      host: solution.host,
      description: `${solution.description}`,
      files: {
        [`${solution.name}.${solution.host}.yaml`]: {
          content: snippet,
        },
      },
    }),
  });

  if (response) {
    yield put(gists.create.success({ gist: response, solution }));
  } else {
    yield put(gists.create.failure(error));
  }
}

function* handleCreateGistSuccessSaga(action: ActionType<typeof gists.create.success>) {
  const { solution } = action.payload;
  yield put(
    solutions.edit({
      id: solution.id,
      solution: { source: { id: action.payload.gist.id, origin: 'gist' } },
    }),
  );
}

function* updateGistSaga(action: ActionType<typeof gists.update.request>) {
  const token = yield select(selectors.github.getToken);
  if (!token) {
    return;
  }

  const solution = yield select(selectors.solutions.get, action.payload.solutionId);
  const snippet = YAML.safeDump(convertSolutionToSnippet(solution));
  const gistId = solution.source.id;

  if (!gistId) {
    yield put(gists.update.failure(new Error('No gistId for this solution.')));
  } else {
    const { response, error } = yield call(github.request, {
      method: 'PATCH',
      path: `gists/${gistId}`,
      isArrayResponse: false,
      token,
      jsonPayload: JSON.stringify({
        description: `${solution.description}`,
        files: {
          [`${solution.name}.${solution.host}.yaml`]: {
            content: snippet,
          },
        },
      }),
    });

    if (response) {
      yield put(gists.update.success({ gist: response }));
    } else {
      yield put(gists.update.failure(error));
    }
  }
}

function* importSnippetSaga(action: ActionType<typeof gists.importSnippet.request>) {
  try {
    let login;
    let snippet;
    if (action.payload.gistId) {
      const { response, error } = yield call(github.request, {
        method: 'GET',
        path: `gists/${action.payload.gistId}`,
      });
      if (response) {
        const gistFiles = response.files;
        login = response.owner.login;
        snippet = YAML.safeLoad(gistFiles[Object.keys(gistFiles)[0]].content);
      } else {
        throw error;
      }
    } else if (action.payload.gist) {
      snippet = YAML.safeLoad(action.payload.gist);
    } else {
      throw new Error('Either a gistId or gist must be specified');
    }

    const solution = convertSnippetToSolution(snippet);
    const host = yield select(selectors.host.get);

    if (solution.host !== host) {
      throw new Error(`Cannot import a snippet created for ${solution.host} in ${host}.`);
    }

    yield call(checkForUnsupportedAPIsIfRelevant, snippet);

    const username = yield select(selectors.github.getUsername);
    solution.options.isUntrusted = login !== username;

    yield put(gists.importSnippet.success({ solution }));
  } catch (e) {
    yield put(gists.importSnippet.failure(e));
    yield put(editor.open());
  }
}

function* handleImportSnippetSuccessSaga(
  action: ActionType<typeof gists.importSnippet.success>,
) {
  yield call(createSolutionSaga, action.payload.solution);
}
