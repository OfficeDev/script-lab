import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { getSolutionsMap } from './solutions'
import { getFiles, getFilesMap } from './files'
import { convertExtensionToLanguage } from '../utilities'

// Actions
export const openSolution = createAction('SOLUTION_OPEN')
export const changeActiveSolution = createAction('SOLUTION_CHANGE_ACTIVE')
export const changeActiveFile = createAction('FILE_CHANGE_ACTIVE')

// State
interface ISelectionState {
  solutionId: string
  fileId: string
}

const initialState: ISelectionState = { solutionId: '123456789', fileId: '456' }

// Reducers
export default handleActions(
  {
    SOLUTION_CHANGE_ACTIVE: (state, { payload }) => ({ ...state, solutionId: payload }),
    FILE_CHANGE_ACTIVE: (state, { payload }) => ({ ...state, fileId: payload }),
  },

  initialState,
)

// Selectors
export const getActiveSolutionId = state => state.selection.solutionId
export const getActiveFileId = state => state.selection.fileId

// export const getActiveSolution = state =>
//   getSolutionsMap(state)[getActiveSolutionId(state)];
// export const getActiveSolutionsFiles = state =>
//   getActiveSolution(state).files.map(fileId => getFilesMap(state)[fileId]);

export const getActiveSolution = createSelector(
  [getActiveSolutionId, getSolutionsMap],
  (activeSolutionId, solutionsMap) =>
    activeSolutionId ? solutionsMap[activeSolutionId] : null,
)

export const getActiveSolutionsFiles = createSelector(
  [getActiveSolution, getFilesMap],
  (activeSolution, filesMap) =>
    activeSolution ? activeSolution.files.map(fileId => filesMap[fileId]) : [],
)

export const getActiveFile = createSelector(
  [getActiveFileId, getFilesMap],
  (activeFileId, filesMap) => (activeFileId ? filesMap[activeFileId] : null),
)

export const getActiveFileLanguage = createSelector(getActiveFile, activeFile =>
  convertExtensionToLanguage(activeFile),
)
