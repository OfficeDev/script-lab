import { createAction, handleActions } from 'redux-actions'

import { getActiveSolution } from './selection'

// Types
export interface IFile {
  id: number
  name: string
  language: string // TODO: refactor to be a computed property
  dateCreated: number
  dateLastModified: number
  content: string
}

export const defaultScriptLabFiles: Array<Partial<IFile>> = [
  {
    name: 'index.ts',
    language: 'typescript',
    content: `// hello world ${new Date().toUTCString()}\n`,
  },
  { name: 'index.html', language: 'html', content: '<div>hello world</div>\n' },
  { name: 'index.css', language: 'css', content: 'div {\n\tbackground-color: #333\n}\n' },
]

// Actions
export const addFiles = createAction('FILES_ADD')
export const deleteFile = createAction('FILE_DELETE')
export const editFile = createAction('FILE_EDIT')

// State
const initialState = {}

// Reducers
export default handleActions(
  {
    FILES_ADD: (state, { payload }) => ({
      ...state,
      ...payload.reduce((obj, file) => {
        obj[file.id] = file
        return obj
      }, {}),
    }),
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
