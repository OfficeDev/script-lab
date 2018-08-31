import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { editor, IEditorAction } from '../actions'
import { EDITOR_PATH } from '../../constants'

type IIsVisibleState = boolean

const initialVisibility =
  window.location.hash.replace('#', '') === EDITOR_PATH ||
  window.location.pathname === EDITOR_PATH
const isVisible = (state: IIsVisibleState = initialVisibility, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      return action.payload.location.pathname === EDITOR_PATH
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
    case getType(editor.open):
      return action.payload
    default:
      return state
  }
}

export interface IState {
  isVisible: IIsVisibleState
  active: IActiveState
}

export default combineReducers({
  isVisible,
  active,
})
