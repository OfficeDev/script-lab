import { put, takeEvery, select, call, all } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';
import selectors from '../selectors';
import { editor, settings, screen, misc, solutions } from '../actions';
import { LIBRARIES_FILE_NAME, NULL_SOLUTION_ID } from '../../../../constants';
import { hideSplashScreen } from 'common/lib/utilities/splash.screen';

import {
  registerLibrariesMonacoLanguage,
  registerSettingsMonacoLanguage,
  enablePrettierInMonaco,
  parseTripleSlashRefs,
  doesMonacoExist,
} from './utilities';

import { currentRunnerUrl, getCurrentEnv } from 'common/lib/environment';

let monacoEditor;

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
    yield put(editor.newFileOpened(solutionToOpen, fileToOpen));
  }
}

function* onSolutionEditSaga(action: ActionType<typeof solutions.edit>) {
  if (!action.payload.fileId) {
    return;
  }
  const file = yield select(selectors.solutions.getFile, action.payload.fileId);
  if (file.language === 'libraries') {
    yield put(editor.shouldUpdateIntellisense());
  }
}

function* onSolutionOpenSaga() {
  yield put(editor.shouldUpdateIntellisense());
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

  const { content } = libraries;
  let pendingUrls: string[] = [];

  content.split('\n').forEach((library: string) => {
    library = library.trim();

    if (library.startsWith('//') || library.startsWith('#')) {
      return;
    }

    if (/^@types/.test(library)) {
      const url = `https://unpkg.com/${library}/index.d.ts`;
      pendingUrls.push(url);
    } else if (/^dt~/.test(library)) {
      const libName = library.split('dt~')[1];
      const url = `https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/${libName}/index.d.ts`;
      pendingUrls.push(url);
    } else if (/\.d\.ts$/i.test(library)) {
      if (/^https?:/i.test(library)) {
        pendingUrls.push(library);
      } else {
        pendingUrls.push(`https://unpkg.com/${library}`);
      }
    }
  });

  const validUrls = [];

  while (pendingUrls.length > 0) {
    const currentUrlsToFetch = [...pendingUrls];
    pendingUrls = [];

    // TODO: we seem to be wasteful in getting the contents but not caching it.
    // Should fix this as part of https://github.com/OfficeDev/script-lab/issues/38.
    // Should also be caching to avoid circular-reference issues when we do
    // "parseTripleSlashRefs" (i.e., cross-reference against existing).
    // See https://github.com/OfficeDev/script-lab/issues/337 for related issue.
    yield all(
      currentUrlsToFetch.map(
        async (url: string): Promise<{ url: string; content: string } | null> => {
          try {
            const resp = await fetch(url);
            if (resp.ok) {
              const content = await resp.text();
              validUrls.push(url);
              logIfVerbose(`Fetched IntelliSense for ${url}`);
              const followUpFetches = parseTripleSlashRefs(url, content);
              if (followUpFetches.length > 0) {
                logIfVerbose(
                  'Need to follow up with IntelliSense fetch for ',
                  followUpFetches,
                );
                pendingUrls = [...pendingUrls, ...followUpFetches];
              }

              return { url, content };
            } else {
              throw new Error(
                `Could not fetch library "${url}", error "${resp.statusText}".`,
              );
            }
          } catch (e) {
            console.error(e);
            return null;
          }
        },
      ),
    );
  }

  logIfVerbose(
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
        .map(url =>
          fetch(url)
            .then(resp => (resp.ok ? resp.text() : Promise.reject(resp.statusText)))
            .then(content => {
              const disposable = monaco.languages.typescript.typescriptDefaults.addExtraLib(
                content,
                url,
              );
              return { url, disposable };
            })
            .catch(error => {
              // this should theoretically never get hit unless
              // the library author has an invalid url in their index.d.ts
              console.error(error);
              return null;
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
  if (monacoEditor) {
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

// TODO: (MZ to Nico): After refactor, move to common place where we can use it across the codebase.
function logIfVerbose(...args: any[]) {
  if (getCurrentEnv() === 'local') {
    console.log('Verbose (localhost only):', ...args);
  }
}
