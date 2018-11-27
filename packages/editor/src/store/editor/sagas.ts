import { put, takeEvery, select, call, all } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';
import selectors from '../selectors';
import { editor, settings, screen, misc } from '../actions';
import zip from 'lodash/zip';
import flatten from 'lodash/flatten';
import { push, RouterState } from 'connected-react-router';
import { PATHS, LIBRARIES_FILE_NAME } from '../../constants';

import {
  registerLibrariesMonacoLanguage,
  registerSettingsMonacoLanguage,
  enablePrettierInMonaco,
  parseTripleSlashRefs,
  doesMonacoExist,
} from './utilities';
import { convertSolutionToSnippet } from '../../utils';
import { actions } from '..';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

let monacoEditor;

export default function* editorWatcher() {
  yield takeEvery(getType(editor.open), onEditorOpenSaga);
  yield takeEvery(getType(editor.openFile), onEditorOpenFileSaga);
  yield takeEvery(getType(editor.newSolutionOpened), onSolutionOpenSaga);
  yield takeEvery(getType(editor.newFileOpened), onFileOpenSaga);
  yield takeEvery(getType(editor.onMount), initializeMonacoSaga);
  yield takeEvery(getType(misc.hideLoadingSplashScreen), hideLoadingSplashScreen);
  yield takeEvery(getType(editor.applyMonacoOptions), applyMonacoOptionsSaga);
  yield takeEvery(getType(settings.edit.success), applyMonacoOptionsSaga);
  yield takeEvery(getType(editor.setIntellisenseFiles.request), setIntellisenseFilesSaga);
  yield takeEvery(getType(screen.updateSize), resizeEditorSaga);
  yield takeEvery(getType(editor.applyFormatting), applyFormattingSaga);
  yield takeEvery(getType(editor.navigateToRun), navigateToRunSaga);
}

function* onEditorOpenSaga() {
  const { router } = yield select();
  if (router.location.pathname !== PATHS.EDITOR) {
    yield put(push(PATHS.EDITOR));
  }
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
  yield call(onEditorOpenSaga);

  const solutionToOpen = yield select(selectors.solutions.get, solutionId);
  const fileToOpen = yield select(selectors.solutions.getFile, fileId);

  if (currentOpenSolution.id !== solutionId) {
    yield put(editor.newSolutionOpened(solutionToOpen));
  }

  if (currentOpenFile.id !== fileId) {
    yield put(editor.newFileOpened(solutionToOpen, fileToOpen));
  }
}

function* onSolutionOpenSaga() {
  if (doesMonacoExist()) {
    yield call(makeAddIntellisenseRequestSaga);
  }
}

function* onFileOpenSaga(action: ActionType<typeof editor.newFileOpened>) {
  if (doesMonacoExist()) {
    yield put(editor.applyMonacoOptions());
  }
  const isPrettierEnabled = yield select(selectors.settings.getIsPrettierEnabled);
  const isAutoFormatEnabled = yield select(selectors.settings.getIsAutoFormatEnabled);
  if (
    isPrettierEnabled &&
    isAutoFormatEnabled &&
    action.payload.file.language === 'typescript'
  ) {
    yield put(editor.applyFormatting());
  }
}

export function* hideLoadingSplashScreen() {
  const loadingIndicator = document.getElementById('loading')!;
  loadingIndicator.style.visibility = 'hidden';
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
  const solution = yield select(selectors.editor.getActiveSolution);
  const libraries = solution.files.find(file => file.name === LIBRARIES_FILE_NAME);
  let urls: string[] = [];

  if (!libraries) {
    return;
  }

  const { content } = libraries;

  content.split('\n').forEach(library => {
    library = library.trim();
    if (/^@types/.test(library)) {
      const url = `https://unpkg.com/${library}/index.d.ts`;
      urls.push(url);
    } else if (/^dt~/.test(library)) {
      const libName = library.split('dt~')[1];
      const url = `https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/${libName}/index.d.ts`;
      urls.push(url);
    } else if (/\.d\.ts$/i.test(library)) {
      if (/^https?:/i.test(library)) {
        urls.push(library);
      } else {
        urls.push(`https://unpkg.com/${library}`);
      }
    }
  });
  let urlsToFetch = urls.filter(url => /^.*\/index\.d\.ts$/.test(url));

  while (urlsToFetch.length > 0) {
    const urlContents = yield all(
      urlsToFetch
        .map(url =>
          fetch(url)
            .then(resp => (resp.ok ? resp.text() : Promise.reject(resp.statusText)))
            .catch(err => {
              console.error(err);
              return null;
            }),
        )
        .filter(x => x !== null),
    );

    const urlContentPairing = zip(urlsToFetch, urlContents) as string[][];

    urlsToFetch = flatten(
      urlContentPairing.map(([url, content]) => parseTripleSlashRefs(url, content)),
    );
    urls = [...urls, ...urlsToFetch];
  }

  yield put(editor.setIntellisenseFiles.request({ urls }));
}

function* setIntellisenseFilesSaga(
  action: ActionType<typeof editor.setIntellisenseFiles.request>,
) {
  const existingIntellisenseFiles = yield select(selectors.editor.getIntellisenseFiles);
  const existingUrls = Object.keys(existingIntellisenseFiles);
  const currentUrls = action.payload.urls;
  const urlsToDispose = existingUrls.filter(url => !currentUrls.includes(url));
  urlsToDispose.forEach(url => existingIntellisenseFiles[url].dispose());
  const urlsToFetch = currentUrls.filter(url => !existingUrls.includes(url));
  const newIntellisenseFiles = yield call(() =>
    Promise.all(
      urlsToFetch.map(url =>
        fetch(url)
          .then(resp => resp.text())
          .then(content => {
            const disposable = monaco.languages.typescript.typescriptDefaults.addExtraLib(
              content,
              url,
            );
            return { url, disposable };
          }),
      ),
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
  if (monacoEditor) {
    monacoEditor.trigger(
      'editor' /* source, unused */,
      'editor.action.formatDocument',
      '' /* payload, unused */,
    );
  }
}

function* navigateToRunSaga() {
  // TODO: Zlatkovsky clean up
  const runnerUrl = {
    'http://localhost:3000': 'http://localhost:3200',
    'https://localhost:3000': 'https://localhost:3200',
    'https://script-lab-react-alpha.azurewebsites.net':
      'https://script-lab-react-runner-alpha.azurewebsites.net',
    'https://script-lab-react-beta.azurewebsites.net':
      'https://script-lab-react-runner-beta.azurewebsites.net',
    'https://script-lab.azureedge.net':
      'https://script-lab-react-runner.azurewebsites.net',
  }[window.location.origin];

  window.location.href = runnerUrl;
}
