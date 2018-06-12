import { createAction, handleActions } from 'redux-actions'

import { getActiveSolution } from './selection'

// Types
export interface IFile {
  id: number
  name: string
  language: string // TODO: refactor to be a computed property
  date_created: number
  date_last_modified: number
  content: string
}

// Actions
export const addFile = createAction('FILE_ADD')
export const deleteFile = createAction('FILE_DELETE')
export const editFile = createAction('FILE_EDIT')

// State
const initialState = {}

// Reducers
export default handleActions(
  {
    FILE_ADD: (state, { payload }) => ({ ...state, [payload.id]: payload }),
    FILE_DELETE: (state, { payload }) =>
      Object.keys(state)
        .filter(fileId => fileId !== payload)
        .map(fileId => state[fileId]),
    FILE_EDIT: (state, { payload }) => ({ ...state, [payload.id]: payload }), // hmm maybe add or edit can be removed
  },
  initialState,
)

// Selectors
export const getFiles = state => Object.values(state.files)
export const getFilesMap = state => state.files
