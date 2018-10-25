import { put, takeEvery, select } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'
import selectors from '../selectors'
import { editor } from '../actions'
import { push } from 'connected-react-router'
import { PATHS } from '../../constants'
import {
  registerLibrariesMonacoLanguage,
  registerSettingsMonacoLanguage,
  enablePrettierInMonaco,
} from './utilities'

export function* openSolutionSaga(action: ActionType<typeof editor.open>) {
  yield put(push(PATHS.EDITOR))
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
}

export function* applyMonacoOptionsSaga() {
  const monacoOptions = yield select(selectors.settings.getMonacoOptions)
  const editor: monaco.editor.IStandaloneCodeEditor | null = yield select(
    selectors.editor.getMonacoEditor,
  )
  if (editor) {
    editor.updateOptions(monacoOptions)
  }
}

export default function* editorWatcher() {
  yield takeEvery(getType(editor.open), openSolutionSaga)
  yield takeEvery(getType(editor.onMount), initializeMonacoSaga)
  yield takeEvery(getType(editor.onLoadComplete), hasLoadedSaga)
  yield takeEvery(getType(editor.applyMonacoOptions), applyMonacoOptionsSaga)
}
