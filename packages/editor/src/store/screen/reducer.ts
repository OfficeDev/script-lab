import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { screen as screenActions, IScreenAction } from '../actions'

type IWidthState = number
const width = (state: IWidthState = 0, action: IScreenAction) => {
  switch (action.type) {
    case getType(screenActions.updateWidth):
      return action.payload
    default:
      return state
  }
}

export interface IState {
  width: IWidthState
}

export default combineReducers({
  width,
})
