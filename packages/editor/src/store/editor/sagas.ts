import { put, takeEvery, select, call } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'
import selectors from '../selectors'
import { editor } from '../actions'
import zip from 'lodash/zip'
import flatten from 'lodash/flatten'
import { push } from 'connected-react-router'
import { PATHS, LIBRARIES_FILE_NAME } from '../../constants'
import {
  registerLibrariesMonacoLanguage,
  registerSettingsMonacoLanguage,
  enablePrettierInMonaco,
  parseTripleSlashRefs,
} from './utilities'

export function* openSolutionSaga(action: ActionType<typeof editor.open>) {
  yield put(push(PATHS.EDITOR))
  yield call(makeAddIntellisenseRequestSaga)
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
  const theme = yield select(selectors.settings.getMonacoTheme)
  if (theme) {
    monaco.editor.setTheme(theme)
  }

  registerLibrariesMonacoLanguage()
  registerSettingsMonacoLanguage()

  const isPrettierEnabled = yield select(selectors.settings.getIsPrettierEnabled)
  if (isPrettierEnabled) {
    enablePrettierInMonaco()
  }
  yield put(editor.applyMonacoOptions())
  yield put(editor.onLoadComplete())
  yield call(makeAddIntellisenseRequestSaga)
}

function* applyMonacoOptionsSaga() {
  const monacoOptions = yield select(selectors.settings.getMonacoOptions)
  const editor: monaco.editor.IStandaloneCodeEditor | null = yield select(
    selectors.editor.getMonacoEditor,
  )
  if (editor) {
    editor.updateOptions(monacoOptions)
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
    const urlContents = yield call(
      () => urlsToFetch.map(url => fetch(url).then(resp => resp.text())), // TODO: error handling
    )
    const urlContentPairing = zip(urlsToFetch, urlContents)

    urlsToFetch = flatten(
      urlContentPairing.map(([url, content]) => parseTripleSlashRefs(url, content)),
    )
    urls = [...urls, ...urlsToFetch]
  }

  yield put(editor.addIntellisenseFiles.request({ urls }))
}

export default function* editorWatcher() {
  yield takeEvery(getType(editor.open), openSolutionSaga)
  yield takeEvery(getType(editor.onMount), initializeMonacoSaga)
  yield takeEvery(getType(editor.onLoadComplete), hasLoadedSaga)
  yield takeEvery(getType(editor.applyMonacoOptions), applyMonacoOptionsSaga)
}
