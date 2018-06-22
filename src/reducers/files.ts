import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { files, IFilesAction } from '../actions'

const file = (state: IFile, action: IFilesAction) => {
  switch (action.type) {
    case getType(files.edit):
      return { ...state, ...action.payload.file }
    default:
      return state
  }
}

const byId = (state: { [id: string]: IFile } = {}, action: IFilesAction) => {
  switch (action.type) {
    case getType(files.add):
      return {
        ...state,
        ...action.payload.reduce((filesMap, f) => {
          filesMap[f.id] = f
          return filesMap
        }, {}),
      }

    case getType(files.edit):
      return {
        ...state,
        [action.payload.id]: file(state[action.payload.id], action),
      }

    case getType(files.remove):
      return Object.values(state).reduce((newState, f) => {
        if (action.payload.includes(f.id)) {
          return newState
        } else {
          newState[f.id] = f
          return newState
        }
      }, {})

    default:
      return state
  }
}

const allIds = (state: string[] = [], action: IFilesAction) => {
  switch (action.type) {
    case getType(files.add):
      return [...state, ...action.payload.map(f => f.id)]

    case getType(files.remove):
      return state.filter(id => !action.payload.includes(id))

    default:
      return state
  }
}

export default combineReducers({
  byId,
  allIds,
})

// selectors
export const get = (state, id: string): IFile => state.byId[id]
