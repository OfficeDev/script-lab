import { put, takeEvery, select, call, all } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';
import selectors from '../selectors';
import { editor, settings, screen, misc, solutions, messageBar } from '../actions';
import { LIBRARIES_FILE_NAME, NULL_SOLUTION_ID } from '../../../../constants';
import { hideSplashScreen } from 'common/lib/utilities/splash.screen';

import {
  registerLibrariesMonacoLanguage,
  registerSettingsMonacoLanguage,
  enablePrettierInMonaco,
  parseTripleSlashRefs,
  doesMonacoExist,
  fetchLibraryContent,
} from './utilities';

import * as log from 'common/lib/utilities/log';
const logger = log.getLogger('Editor');

import { currentRunnerUrl } from 'common/lib/environment';

let monacoEditor: monaco.editor.IStandaloneCodeEditor;

export default function* editorWatcher() {
  yield takeEvery(getType(editor.openFile), onEditorOpenFileSaga);
  yield takeEvery(getType(solutions.edit), onSolutionEditSaga);
  yield takeEvery(getType(editor.newSolutionOpened), onSolutionOpenSaga);
  yield takeEvery(getType(editor.newFileOpened), onFileOpenSaga);
  yield takeEvery(getType(editor.onMount), initializeMonacoSaga);
  yield takeEvery(getType(misc.hideLoadingSplashScreen), hideLoadingSplashScreenSaga);
  yield takeEvery(getType(editor.applyMonacoOptions), applyMonacoOptionsSaga);
  yield takeEvery(getType(settings.edit.success), applyMonacoOptionsSaga);
  yield takeEvery(
    getType(editor.shouldUpdateIntellisense),
    makeAddIntellisenseRequestSaga,
  );
  yield takeEvery(getType(editor.setIntellisenseFiles.request), setIntellisenseFilesSaga);
  yield takeEvery(getType(screen.updateSize), resizeEditorSaga);
  yield takeEvery(getType(messageBar.dismiss), resizeEditorSaga);
  yield takeEvery(getType(editor.applyFormatting), applyFormattingSaga);
  yield takeEvery(getType(editor.navigateToRun), navigateToRunSaga);
}

export function* onEditorOpenFileSaga(action: ActionType<typeof editor.openFile>) {
  const currentOpenSolution: ISolution = yield select(selectors.editor.getActiveSolution);
  const currentOpenFile = yield select(selectors.editor.getActiveFile);

  // tslint:disable-next-line:prefer-const
  let { solutionId, fileId } = action.payload;
  if (!solutionId) {
    if (!currentOpenSolution.files.find(file => file.id === fileId)) {
      throw new Error(`The file id ${fileId} does not exist in current open solution.`);
    } else {
      solutionId = currentOpenSolution.id;
    }
  }

  yield put(editor.setActive({ solutionId, fileId }));
  if (solutionId !== NULL_SOLUTION_ID) {
    yield put(editor.open());
  }

  const solutionToOpen = yield select(selectors.solutions.get, solutionId);
  const fileToOpen = yield select(selectors.solutions.getFile, fileId);

  if (solutionToOpen && currentOpenSolution.id !== solutionId) {
    yield put(editor.newSolutionOpened(solutionToOpen));
  }

  if (fileToOpen && currentOpenFile.id !== fileId) {
    yield put(editor.newFileOpened({ solution: solutionToOpen, file: fileToOpen }));
  }
}

function* onSolutionEditSaga(action: ActionType<typeof solutions.edit>) {}

function* onSolutionOpenSaga() {}

function* onFileOpenSaga(action: ActionType<typeof editor.newFileOpened>) {
  if (doesMonacoExist()) {
    yield put(editor.applyMonacoOptions());
  }

  if (action.payload.file.language === 'typescript') {
    yield put(editor.shouldUpdateIntellisense());
  }

  yield put(
    solutions.updateLastOpened({
      solutionId: action.payload.solution.id,
      fileId: action.payload.file.id,
    }),
  );
}

export function* hideLoadingSplashScreenSaga() {
  hideSplashScreen();
}

function* initializeMonacoSaga(action: ActionType<typeof editor.onMount>) {
  monacoEditor = action.payload;
  const theme = yield select(selectors.settings.getMonacoTheme);
  if (theme) {
    monaco.editor.setTheme(theme);
  }

  registerLibrariesMonacoLanguage();
  registerSettingsMonacoLanguage();

  monacoEditor.addAction({
    id: 'trigger-suggest',
    label: 'Trigger suggestion',
    keybindings: [monaco.KeyCode.F2],
    contextMenuGroupId: 'navigation',
    contextMenuOrder: 0 /* put at top of context menu */,
    run: () =>
      monacoEditor.trigger(
        'editor' /* source, unused */,
        'editor.action.triggerSuggest',
        {},
      ),
  });

  yield put(editor.applyMonacoOptions());
  yield put(misc.hideLoadingSplashScreen());
  yield call(makeAddIntellisenseRequestSaga);
}

function* applyMonacoOptionsSaga() {
  if (monacoEditor) {
    const monacoOptions = yield select(selectors.settings.getMonacoOptions);
    const { theme } = monacoOptions;

    monacoEditor.updateOptions(monacoOptions);
    monaco.editor.setTheme(theme);
  }
  const isPrettierEnabled = yield select(selectors.settings.getIsPrettierEnabled);
  if (isPrettierEnabled) {
    const tabWidth = yield select(selectors.settings.getTabSize);
    enablePrettierInMonaco({ tabWidth });
  }
}

function* makeAddIntellisenseRequestSaga() {
  if (!doesMonacoExist()) {
    return;
  }

  const solution: ISolution = yield select(selectors.editor.getActiveSolution);
  const libraries = solution.files.find(file => file.name === LIBRARIES_FILE_NAME);
  if (!libraries) {
    return;
  }

  const host = yield select(selectors.host.get);
  const defaultEverPresentLibs =
    host === 'EXCEL' ? ['@types/custom-functions-runtime'] : [];

  const entries = [...defaultEverPresentLibs, ...libraries.content.split('\n')];

  let pendingUrls: string[] = entries
    .map((library: string) => {
      library = library.trim();

      if (library.startsWith('//') || library.startsWith('#')) {
        return null;
      }

      if (/^@types/.test(library)) {
        return `https://unpkg.com/${library}/index.d.ts`;
      } else if (/^dt~/.test(library)) {
        const libName = library.split('dt~')[1];
        return `https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/${libName}/index.d.ts`;
      } else if (/\.d\.ts$/i.test(library)) {
        if (/^https?:/i.test(library)) {
          return library;
        } else {
          return `https://unpkg.com/${library}`;
        }
      }

      return null;
    })
    .filter(url => url);

  const validUrls = [];

  while (pendingUrls.length > 0) {
    const currentUrlsToFetch = [...pendingUrls];
    pendingUrls = [];

    yield all(
      currentUrlsToFetch.map((url: string) =>
        fetchLibraryContent(url).then((content: string | null) => {
          if (content) {
            validUrls.push(url);
            logger.info(`Fetched IntelliSense for ${url}`);
            const followUpFetches = parseTripleSlashRefs(url, content);
            if (followUpFetches.length > 0) {
              logger.info(
                'Need to follow up with IntelliSense fetch for ',
                followUpFetches,
              );
              pendingUrls = [...pendingUrls, ...followUpFetches];
            }
          } else {
            logger.error(`Could not fetch library "${url}".`);
          }
        }),
      ),
    );
  }

  logger.info(
    ['Ready to give URLS to Monaco: ', ...validUrls.map(url => ' - ' + url)].join('\n'),
  );

  yield put(editor.setIntellisenseFiles.request({ urls: validUrls }));
}

function* setIntellisenseFilesSaga(
  action: ActionType<typeof editor.setIntellisenseFiles.request>,
) {
  const existingIntellisenseFiles = yield select(selectors.editor.getIntellisenseFiles);
  const existingUrls = Object.keys(existingIntellisenseFiles);
  const currentUrls = action.payload.urls;

  const urlsToDispose = existingUrls.filter(url => !currentUrls.includes(url));
  urlsToDispose.forEach(url => existingIntellisenseFiles[url].dispose());
  yield put(editor.removeIntellisenseFiles(urlsToDispose));

  const urlsToFetch = currentUrls.filter(url => !existingUrls.includes(url));
  const newIntellisenseFiles = yield call(() =>
    Promise.all(
      [...new Set(urlsToFetch)] // to uniquify values
        .map((url: string) =>
          fetchLibraryContent(url).then((content: string | null) => {
            if (content) {
              const disposable = monaco.languages.typescript.typescriptDefaults.addExtraLib(
                content,
                url,
              );
              return { url, disposable };
            } else {
              return null;
            }
          }),
        )
        .filter(x => x !== null),
    ),
  );
  yield put(
    editor.setIntellisenseFiles.success(
      newIntellisenseFiles.reduce(
        (acc, { url, disposable }) => ({ ...acc, [url]: disposable }),
        {},
      ),
    ),
  );
}

function* resizeEditorSaga() {
  if (monacoEditor) {
    monacoEditor.layout();
  }
}

function* applyFormattingSaga() {
  const isAutoFormatEnabled = yield select(selectors.settings.getIsAutoFormatEnabled);
  if (monacoEditor && isAutoFormatEnabled) {
    monacoEditor.trigger(
      'editor' /* source, unused */,
      'editor.action.formatDocument',
      '' /* payload, unused */,
    );
  }
}

function* navigateToRunSaga() {
  window.location.href = `${currentRunnerUrl}?backButton=true`;
}
