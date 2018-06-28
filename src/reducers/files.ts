import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { files, IFilesAction } from '../actions'

const file = (state: IFile, action: IFilesAction) => {
  switch (action.type) {
    case getType(files.edit):
      return {
        ...state,
        ...action.payload.file,
        dateLastModified: action.payload.timestamp,
      }
    default:
      return state
  }
}

interface IByIdState {
  [id: string]: IFile
}

const byId = (state: IByIdState = {}, action: IFilesAction) => {
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
        [action.payload.fileId]: file(state[action.payload.fileId], action),
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

export interface IFilesState {
  byId: IByIdState
  allIds: string[]
}

export default combineReducers({
  byId,
  allIds,
})

const get = (state: IFilesState, id: string): IFile => state.byId[id]

// selectors
export const selectors = {
  get,
}
