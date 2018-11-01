import { put, takeEvery, select, call } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'
import selectors from '../selectors'
import { editor, settings, screen } from '../actions'
import zip from 'lodash/zip'
import flatten from 'lodash/flatten'
import { push } from 'connected-react-router'
import { PATHS, LIBRARIES_FILE_NAME } from '../../constants'

import {
  registerLibrariesMonacoLanguage,
  registerSettingsMonacoLanguage,
  enablePrettierInMonaco,
  parseTripleSlashRefs,
  doesMonacoExist,
} from './utilities'

let monacoEditor

export default function* editorWatcher() {
  yield takeEvery(getType(editor.open), onEditorOpenSaga)
  yield takeEvery(getType(editor.onMount), initializeMonacoSaga)
  yield takeEvery(getType(editor.onLoadComplete), hasLoadedSaga)
  yield takeEvery(getType(editor.applyMonacoOptions), applyMonacoOptionsSaga)
  yield takeEvery(getType(settings.edit.success), applyMonacoOptionsSaga)
  yield takeEvery(getType(editor.setIntellisenseFiles.request), setIntellisenseFilesSaga)
  yield takeEvery(getType(screen.updateSize), resizeEditorSaga)
  yield takeEvery(getType(editor.applyFormatting), applyFormattingSaga)
}

export function* onEditorOpenSaga(action: ActionType<typeof editor.open>) {
  const activeSolution = yield select(selectors.editor.getActiveSolution)
  const activeFile = yield select(selectors.editor.getActiveFile)
  yield put(editor.setActive(action.payload))
  yield put(push(PATHS.EDITOR))

  if (activeSolution.id !== action.payload.solutionId) {
    yield call(onSolutionOpenSaga)
  }

  if (activeFile.id !== action.payload.fileId) {
    yield call(onFileOpenSaga)
  }
}

function* onSolutionOpenSaga() {
  if (doesMonacoExist()) {
    yield call(makeAddIntellisenseRequestSaga)
  }
}

function* onFileOpenSaga() {
  if (doesMonacoExist()) {
    yield put(editor.applyMonacoOptions())
  }
  const isPrettierEnabled = yield select(selectors.settings.getIsPrettierEnabled)
  const isAutoFormatEnabled = yield select(selectors.settings.getIsAutoFormatEnabled)
  if (isPrettierEnabled && isAutoFormatEnabled) {
    yield put(editor.applyFormatting())
  }
}

export function* hasLoadedSaga(action: ActionType<typeof editor.onLoadComplete>) {
  const loadingIndicator = document.getElementById('loading')
  if (loadingIndicator) {
    const { parentNode } = loadingIndicator
    if (parentNode) {
      parentNode.removeChild(loadingIndicator)
    }
  }
}

function* initializeMonacoSaga(action: ActionType<typeof editor.onMount>) {
  monacoEditor = action.payload
  const theme = yield select(selectors.settings.getMonacoTheme)
  if (theme) {
    monaco.editor.setTheme(theme)
  }

  registerLibrariesMonacoLanguage()
  registerSettingsMonacoLanguage()

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
  })

  yield put(editor.applyMonacoOptions())
  yield put(editor.onLoadComplete())
  yield call(makeAddIntellisenseRequestSaga)
}

function* applyMonacoOptionsSaga() {
  if (monacoEditor) {
    const monacoOptions = yield select(selectors.settings.getMonacoOptions)
    const { theme } = monacoOptions

    monacoEditor.updateOptions(monacoOptions)
    monaco.editor.setTheme(theme)
  }
  const isPrettierEnabled = yield select(selectors.settings.getIsPrettierEnabled)
  if (isPrettierEnabled) {
    const tabWidth = yield select(selectors.settings.getTabSize)
    enablePrettierInMonaco({ tabWidth })
  }
}

function* makeAddIntellisenseRequestSaga() {
  const solution = yield select(selectors.editor.getActiveSolution)
  const libraries = solution.files.find(file => file.name === LIBRARIES_FILE_NAME)
  let urls: string[] = []

  if (!libraries) {
    return
  }

  const { content } = libraries

  content.split('\n').forEach(library => {
    library = library.trim()
    if (/^@types/.test(library)) {
      const url = `https://unpkg.com/${library}/index.d.ts`
      urls.push(url)
    } else if (/^dt~/.test(library)) {
      const libName = library.split('dt~')[1]
      const url = `https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/${libName}/index.d.ts`
      urls.push(url)
    } else if (/\.d\.ts$/i.test(library)) {
      if (/^https?:/i.test(library)) {
        urls.push(library)
      } else {
        urls.push(`https://unpkg.com/${library}`)
      }
    }
  })
  let urlsToFetch = urls.filter(url => /^.*\/index\.d\.ts$/.test(url))

  while (urlsToFetch.length > 0) {
    const urlContents = yield urlsToFetch.map(url => fetch(url).then(resp => resp.text())) // TODO: error handling

    const urlContentPairing = zip(urlsToFetch, urlContents)

    urlsToFetch = flatten(
      urlContentPairing.map(([url, content]) => parseTripleSlashRefs(url, content)),
    )
    urls = [...urls, ...urlsToFetch]
  }

  yield put(editor.setIntellisenseFiles.request({ urls }))
}

function* setIntellisenseFilesSaga(
  action: ActionType<typeof editor.setIntellisenseFiles.request>,
) {
  const existingIntellisenseFiles = yield select(selectors.editor.getIntellisenseFiles)
  const existingUrls = Object.keys(existingIntellisenseFiles)
  const currentUrls = action.payload.urls
  const urlsToDispose = existingUrls.filter(url => !currentUrls.includes(url))
  urlsToDispose.forEach(url => existingIntellisenseFiles[url].dispose())
  const urlsToFetch = currentUrls.filter(url => !existingUrls.includes(url))
  const newIntellisenseFiles = yield call(() =>
    Promise.all(
      urlsToFetch.map(url =>
        fetch(url)
          .then(resp => resp.text())
          .then(content => {
            const disposable = monaco.languages.typescript.typescriptDefaults.addExtraLib(
              content,
              url,
            )
            return { url, disposable }
          }),
      ),
    ),
  )
  yield put(
    editor.setIntellisenseFiles.success(
      newIntellisenseFiles.reduce(
        (acc, { url, disposable }) => ({ ...acc, [url]: disposable }),
        {},
      ),
    ),
  )
}

function* resizeEditorSaga() {
  if (monacoEditor) {
    monacoEditor.layout()
  }
}

function* applyFormattingSaga() {
  console.log('trying to apply formatting')
  if (monacoEditor) {
    console.log('applying formatting')
    setTimeout(
      () =>
        monacoEditor.trigger(
          'editor' /* source, unused */,
          'editor.action.formatDocument',
          '',
        ),
      200,
    )
  }
}
