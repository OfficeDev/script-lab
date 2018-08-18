import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

import { solutions as solutionActions, ISolutionsAction } from '../actions'

interface IMetadataState {
  [id: string]: ISolutionWithFileIds
}

const metadata = (
  state: IMetadataState = {},
  action: ISolutionsAction,
): IMetadataState => {
  switch (action.type) {
    case getType(solutionActions.add):
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload,
          files: action.payload.files.map(file => file.id),
        },
      }

    case getType(solutionActions.edit):
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload.solution, // maybe || {}
          dateLastModified: action.payload.timestamp,
        },
      }

    case getType(solutionActions.remove):
      const { [action.payload.id]: omit, ...rest } = state
      return rest

    default:
      return state
  }
}

interface IFilesState {
  [id: string]: IFile
}

const files = (state: IFilesState = {}, action: ISolutionsAction): IFilesState => {
  switch (action.type) {
    case getType(solutionActions.add):
      const filesById = action.payload.files.reduce(
        (all, file) => ({ ...all, [file.id]: file }),
        {},
      )

      return {
        ...state,
        ...filesById,
      }

    case getType(solutionActions.edit):
      const { file, fileId } = action.payload
      if (!file || !fileId) {
        return state
      }

      return {
        ...state,
        [fileId]: {
          ...state[fileId],
          ...file,
          dateLastModified: action.payload.timestamp,
        },
      }

    case getType(solutionActions.remove):
      const fileIdsToRemove = action.payload.files.map(file => file.id)
      return Object.keys(state)
        .map(k => state[k])
        .reduce((newState, f) => {
          if (!fileIdsToRemove.includes(f.id)) {
            newState[f.id] = f
          }
          return newState
        }, {})

    default:
      return state
  }
}

export interface IState {
  metadata: IMetadataState
  files: IFilesState
}

export default combineReducers({
  metadata,
  files,
})
