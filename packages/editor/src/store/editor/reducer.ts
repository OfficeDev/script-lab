import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { editor, IEditorAction } from '../actions'
import { PATHS } from '../../constants'
import omit from 'lodash/omit'

type IIsVisibleState = boolean

const initialVisibility =
  location.hash.replace('#', '') === PATHS.EDITOR ||
  (window.location.pathname === PATHS.EDITOR && window.location.hash === '')

const isVisible = (state: IIsVisibleState = initialVisibility, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      return action.payload.location.pathname === PATHS.EDITOR
    default:
      return state
  }
}

type IHasLoadedState = boolean

const hasLoaded = (state: IHasLoadedState = false, action) => {
  switch (action.type) {
    case getType(editor.onMount):
      return true
    default:
      return state
  }
}

interface IIntellisenseFilesState {
  [url: string]: monaco.IDisposable
}

const intellisenseFiles = (
  state: IIntellisenseFilesState = {},
  action: IEditorAction,
) => {
  switch (action.type) {
    case getType(editor.setIntellisenseFiles.success):
      return { ...state, ...action.payload }
    case getType(editor.removeIntellisenseFiles):
      return omit({ ...state }, action.payload)
    default:
      return state
  }
}

interface IActiveState {
  solutionId: string | null
  fileId: string | null
}

const active = (
  state: IActiveState = { solutionId: null, fileId: null },
  action: IEditorAction,
) => {
  switch (action.type) {
    case getType(editor.setActive):
      return action.payload
    default:
      return state
  }
}

export interface IState {
  isVisible: IIsVisibleState
  hasLoaded: IHasLoadedState
  intellisenseFiles: IIntellisenseFilesState
  active: IActiveState
}

export default combineReducers({
  isVisible,
  hasLoaded,
  intellisenseFiles,
  active,
})
