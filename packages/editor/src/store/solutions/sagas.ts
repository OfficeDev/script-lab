import { put, takeEvery, call, select } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';

import { messageBar, solutions, editor } from '../actions';
import { fetchYaml } from '../../services/general';
import selectors from '../selectors';
import { convertSnippetToSolution } from '../../utils';
import { getBoilerplate } from '../../newSolutionData';
import { SCRIPT_FILE_NAME } from '../../constants';
import { deleteSolutionFromStorage } from '../localStorage';

export default function* solutionsWatcher() {
  yield takeEvery(getType(solutions.edit), onSolutionOpenOrFileEditSaga);
  yield takeEvery(getType(editor.newSolutionOpened), onSolutionOpenOrFileEditSaga);

  yield takeEvery(getType(solutions.create), getDefaultSaga);
  yield takeEvery(getType(solutions.getDefault.success), handleGetDefaultSuccessSaga);
  yield takeEvery(getType(solutions.getDefault.failure), handleGetDefaultFailureSaga);

  yield takeEvery(getType(solutions.updateOptions), updateOptionsSaga);

  yield takeEvery(getType(solutions.remove), removeSolutionSaga);
}

function* onSolutionOpenOrFileEditSaga(
  action: ActionType<typeof solutions.edit> | ActionType<typeof editor.newSolutionOpened>,
) {
  let solutionId;
  switch (action.type) {
    case getType(editor.newSolutionOpened):
      solutionId = action.payload;
      break;

    case getType(solutions.edit):
      if (action.payload.solution && action.payload.solution.options) {
        const solution: ISolution = yield select(
          selectors.solutions.get,
          action.payload.id,
        );
        const prevDirectScriptExecution = !!solution.options.isDirectScriptExecution;
        const newDirectScriptExecution = !!action.payload.solution.options
          .isDirectScriptExecution;

        if (!prevDirectScriptExecution && newDirectScriptExecution) {
          // in this case the solution was just switched from not being
          // a direct script execution to being a direct script execution
          solutionId = action.payload.id;
          break;
        } else {
          return;
        }
      } else if (action.payload.fileId) {
        const file: IFile = yield select(
          selectors.solutions.getFile,
          action.payload.fileId,
        );
        if (file.language === 'typescript') {
          solutionId = action.payload.id;
          break;
        } else {
          return;
        }
      } else {
        return;
      }

    default:
      throw new Error(`Unrecognized type.`);
  }

  const solution = yield select(selectors.solutions.get, solutionId);
  if (!solution) {
    return;
  }

  const file = solution.files.find(file => file.name === SCRIPT_FILE_NAME);
  if (!file) {
    return;
  }

  yield put(solutions.scriptNeedsParsing({ solution, file }));
}

export function* getDefaultSaga() {
  const host: string = yield select(selectors.host.get);
  const response = yield call(
    fetchYaml,
    `https://raw.githubusercontent.com/OfficeDev/office-js-snippets/master/samples/${host.toLowerCase()}/default.yaml`,
  );

  const { content, error } = response;
  if (content) {
    const solution = convertSnippetToSolution(content);
    yield put(solutions.getDefault.success({ solution }));
  } else {
    yield put(solutions.getDefault.failure(error));
  }
}

function* handleGetDefaultSuccessSaga(
  action: ActionType<typeof solutions.getDefault.success>,
) {
  yield call(createSolutionSaga, action.payload.solution);
}

function* handleGetDefaultFailureSaga(
  action: ActionType<typeof solutions.getDefault.success>,
) {
  const host: string = yield select(selectors.host.get);
  const solution = getBoilerplate(host);
  yield call(createSolutionSaga, solution);
}

export function* createSolutionSaga(solution: ISolution) {
  yield put(solutions.add(solution));
  yield put(editor.openFile({ solutionId: solution.id, fileId: solution.files[0].id }));
}

function* removeSolutionSaga(action: ActionType<typeof solutions.remove>) {
  yield call(deleteSolutionFromStorage, action.payload.id);
  yield call(openLastModifiedOrDefaultSolutionSaga);
}

function* updateOptionsSaga(action: ActionType<typeof solutions.updateOptions>) {
  const { solution, options } = action.payload;
  // If the solution options show it as untrusted, but the newly-received options set untrusted to false,
  // go ahead and dismiss the message bar.
  if (solution.options.isUntrusted && options.isUntrusted === false) {
    yield put(messageBar.dismiss());
  }
  yield put(
    solutions.edit({
      id: solution.id,
      solution: { options: { ...solution.options, ...options } },
    }),
  );
}

export function* openLastModifiedOrDefaultSolutionSaga() {
  const solutions = yield select(selectors.solutions.getInLastModifiedOrder);

  if (solutions.length === 0) {
    yield call(getDefaultSaga);
  } else {
    yield put(
      editor.openFile({ solutionId: solutions[0].id, fileId: solutions[0].files[0].id }),
    );
  }
}
