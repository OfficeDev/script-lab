import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { screen as screenActions, IScreenAction } from '../actions'

type IWidthState = number
const width = (state: IWidthState = 0, action: IScreenAction) => {
  switch (action.type) {
    case getType(screenActions.updateSize):
      return action.payload.width
    default:
      return state
  }
}

type IHeightState = number
const height = (state: IHeightState = 0, action: IScreenAction) => {
  switch (action.type) {
    case getType(screenActions.updateSize):
      return action.payload.height
    default:
      return state
  }
}

export interface IState {
  width: IWidthState
  height: IHeightState
}

export default combineReducers({
  width,
  height,
})
