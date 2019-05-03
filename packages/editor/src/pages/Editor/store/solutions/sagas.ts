import { put, takeEvery, call, select } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';

import { messageBar, solutions, editor } from '../actions';
import { fetchYaml } from '../../services/general';
import selectors from '../selectors';
import { convertSnippetToSolution } from '../../../../utils';
import { isCustomFunctionScript } from '../../../../utils/custom-functions';
import { getBoilerplate } from '../../../../newSolutionData';
import { SCRIPT_FILE_NAME, NULL_SOLUTION_ID, NULL_FILE_ID } from '../../../../constants';
import { deleteSolutionFromStorage } from '../localStorage';
import { formatTypeScriptFile } from '../editor/utilities';
import { currentOfficeJsRawSnippetsBaseRepoUrl } from 'common/lib/environment';

export default function* solutionsWatcher() {
  yield takeEvery(getType(solutions.edit), onSolutionOpenOrFileEditSaga);
  yield takeEvery(getType(editor.newSolutionOpened), onSolutionOpenOrFileEditSaga);

  yield takeEvery(getType(solutions.create), getDefaultSaga);
  yield takeEvery(getType(solutions.getDefault.success), handleGetDefaultSuccessSaga);
  yield takeEvery(getType(solutions.getDefault.failure), handleGetDefaultFailureSaga);

  yield takeEvery(getType(solutions.updateOptions), updateOptionsSaga);

  yield takeEvery(getType(solutions.remove), removeSolutionSaga);
  yield takeEvery(getType(solutions.scriptNeedsParsing), checkIfIsCustomFunctionSaga);
}

function* onSolutionOpenOrFileEditSaga(
  action: ActionType<typeof solutions.edit> | ActionType<typeof editor.newSolutionOpened>,
) {
  let solutionId: string;
  switch (action.type) {
    case getType(editor.newSolutionOpened):
      solutionId = action.payload.id;
      break;

    case getType(solutions.edit):
      if (action.payload.fileId) {
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
    `${currentOfficeJsRawSnippetsBaseRepoUrl}/samples/${host.toLowerCase()}/default.yaml`,
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
  // TODO: eventually optimize perf see https://github.com/OfficeDev/script-lab-react/issues/343
  // after testing it a few times, it runs anywhere from 4ms to 100ms
  let newSolution = solution;
  const tabWidth = yield select(selectors.settings.getTabSize);
  const script = solution.files.find(file => file.name === SCRIPT_FILE_NAME);
  if (script) {
    const newContent = yield call(formatTypeScriptFile, script.content, { tabWidth });
    newSolution = {
      ...solution,
      files: [
        { ...script, content: newContent },
        ...solution.files.filter(file => file.name !== SCRIPT_FILE_NAME),
      ],
    };
  }
  yield put(solutions.add(newSolution));
  yield put(
    editor.openFile({ solutionId: newSolution.id, fileId: newSolution.files[0].id }),
  );
}

function* removeSolutionSaga(action: ActionType<typeof solutions.remove>) {
  yield call(open2ndToLastOpenedOrBackstageSaga);
  yield put(solutions.deleteFromState(action.payload));
  yield call(deleteSolutionFromStorage, action.payload.id);
}

function* updateOptionsSaga(action: ActionType<typeof solutions.updateOptions>) {
  const { options, id } = action.payload;
  const solution = yield select(selectors.solutions.get, id);

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

export function* openLastOpenedOrBackstageSaga() {
  const solutions = yield select(selectors.solutions.getInLastOpenedOrder);

  if (solutions.length === 0) {
    yield put(editor.openFile({ solutionId: NULL_SOLUTION_ID, fileId: NULL_FILE_ID }));
    yield put(editor.openBackstage());
  } else {
    yield put(
      editor.openFile({ solutionId: solutions[0].id, fileId: solutions[0].files[0].id }),
    );
  }
}

export function* open2ndToLastOpenedOrBackstageSaga() {
  const solutions = yield select(selectors.solutions.getInLastOpenedOrder);

  if (solutions.length <= 1) {
    yield put(editor.openFile({ solutionId: NULL_SOLUTION_ID, fileId: NULL_FILE_ID }));
    yield put(editor.openBackstage());
  } else {
    yield put(
      editor.openFile({ solutionId: solutions[1].id, fileId: solutions[1].files[0].id }),
    );
  }
}

function* checkIfIsCustomFunctionSaga(
  action: ActionType<typeof solutions.scriptNeedsParsing>,
) {
  const { solution, file } = action.payload;

  // For now, assuming that if it's Python, it must be a CF.
  // Whereas for TypeScript, will need to check the jsdoc attributes
  const isCustomFunctionsSolution =
    file.language === 'python' || isCustomFunctionScript(file.content);

  // Compare what is currently in the solution with what we want to update it to (via XOR)
  const optionsChanged =
    (!solution.options.isCustomFunctionsSolution && isCustomFunctionsSolution) ||
    (solution.options.isCustomFunctionsSolution && !isCustomFunctionsSolution);
  if (optionsChanged) {
    yield put(
      solutions.updateOptions({
        id: solution.id,
        options: { isCustomFunctionsSolution },
      }),
    );
  }
}
