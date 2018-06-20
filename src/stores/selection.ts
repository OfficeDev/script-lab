import { createActions, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { getSolutionsMap } from './solutions'
import { getFiles, getFilesMap } from './files'
import { convertExtensionToLanguage } from '../utilities'

// Actions
export const { openSolution, changeActiveSolution, changeActiveFile } = createActions({
  SOLUTION_OPEN: (solutionId: string) => ({ solutionId }),
  SOLUTION_CHANGE_ACTIVE: (solutionId: string) => ({ solutionId }),
  FILE_CHANGE_ACTIVE: (fileId: string) => ({ fileId }),
})

// State
interface ISelectionState {
  solutionId: string
  fileId: string
}

const initialState: ISelectionState = { solutionId: '123456789', fileId: '456' }

// Reducers
export default handleActions(
  {
    SOLUTION_OPEN: (state, { payload: { solutionId } }) => {
      // TODO: make it so that by changing the active solution, it will set the fileId to undefined, and make the selectors respect that if its undefined, grab the first one
      return { ...state, solutionId }
    },
    SOLUTION_CHANGE_ACTIVE: (state, { payload: { solutionId } }) => ({
      ...state,
      solutionId,
    }),
    FILE_CHANGE_ACTIVE: (state, { payload: { fileId } }) => ({
      ...state,
      fileId,
    }),
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
