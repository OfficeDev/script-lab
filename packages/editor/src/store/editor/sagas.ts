import { put, takeEvery, select, call, all } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';
import selectors from '../selectors';
import { customFunctions, editor, settings, screen } from '../actions';
import zip from 'lodash/zip';
import flatten from 'lodash/flatten';
import { push } from 'connected-react-router';
import { PATHS, LIBRARIES_FILE_NAME } from '../../constants';

import {
  registerLibrariesMonacoLanguage,
  registerSettingsMonacoLanguage,
  enablePrettierInMonaco,
  parseTripleSlashRefs,
  doesMonacoExist,
} from './utilities';
import { convertSolutionToSnippet } from '../../utils';

let monacoEditor;

export default function* editorWatcher() {
  yield takeEvery(getType(editor.open), onEditorOpenSaga);
  yield takeEvery(getType(editor.openFile), onEditorOpenFileSaga);
  yield takeEvery(getType(editor.newSolutionOpened), onSolutionOpenSaga);
  yield takeEvery(getType(editor.newFileOpened), onFileOpenSaga);
  yield takeEvery(getType(editor.onMount), initializeMonacoSaga);
  yield takeEvery(getType(editor.hideLoadingSplashScreen), hideLoadingSplashScreen);
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
  const currentOpenSolution = yield select(selectors.editor.getActiveSolution);
  const currentOpenFile = yield select(selectors.editor.getActiveFile);
  yield put(editor.setActive(action.payload));
  yield call(onEditorOpenSaga);

  const solutionToOpen = yield select(selectors.solutions.get, action.payload.solutionId);
  const fileToOpen = yield select(selectors.solutions.getFile, action.payload.fileId);

  if (currentOpenSolution.id !== action.payload.solutionId) {
    yield put(editor.newSolutionOpened(solutionToOpen));
  }

  if (currentOpenFile.id !== action.payload.fileId) {
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
  const loadingIndicator = document.getElementById('loading');
  if (loadingIndicator) {
    const { parentNode } = loadingIndicator;
    if (parentNode) {
      parentNode.removeChild(loadingIndicator);
    }
  }
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
  yield put(editor.hideLoadingSplashScreen());
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
    const urlContents: string[] = yield all(
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

    const urlContentPairing = zip(urlsToFetch, urlContents);

    urlsToFetch = flatten(
      urlContentPairing.map(([url, content]) => parseTripleSlashRefs(url!, content!)),
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
  const activeSolution: ISolution = yield select(selectors.editor.getActiveSolution);
  const snippet = convertSolutionToSnippet(activeSolution);

  const state = {
    snippet: snippet,
    displayLanguage: 'en-us',
    isInsideOfficeApp: (yield call(Office.onReady)).host,
    returnUrl: window.location.href,
    refreshUrl: window.location.origin + '/run.html',
    hideSyncWithEditorButton: true,
  };

  const data = JSON.stringify(state);
  const params = {
    data: data,
    isTrustedSnippet: true,
  };

  const useAlphaRunner =
    /^http(s?):\/\/script-lab-react-alpha\./.test(window.location.href) ||
    /^http(s?):\/\/localhost/.test(window.location.href);
  const path =
    'https://bornholm-runner-' +
    (useAlphaRunner ? 'edge' : 'insiders') +
    '.azurewebsites.net/compile/page';
  const form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', path);

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.setAttribute('type', 'hidden');
      hiddenField.setAttribute('name', key);
      hiddenField.setAttribute('value', params[key]);
      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}
