import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { getInitialSelection } from '../storage';
import { getSolutions } from './solutions';
import { getFiles, getFilesMap } from './files';
import { convertExtensionToLanguage } from '../utilities';

// Actions
export const changeActiveSolution = createAction('SOLUTION_CHANGE_ACTIVE');
export const changeActiveFile = createAction('FILE_CHANGE_ACTIVE');

// State
interface ISelectionState {
  solutionId: string;
  fileId: string;
}

const initialState: ISelectionState = getInitialSelection();

// Reducers
export default handleActions(
  {
    SOLUTION_CHANGE_ACTIVE: (state, { payload }) => ({ ...state, solutionId: payload }),
    FILE_CHANGE_ACTIVE: (state, { payload }) => ({ ...state, fileId: payload }),
  },

  initialState,
);

// Selectors
export const getActiveSolutionId = state => state.selection.solutionId;
export const getActiveFileId = state => state.selection.fileId;

export const getActiveSolution = createSelector(
  [getActiveSolutionId, getSolutions],
  (activeSolutionId, solutions) => solutions[activeSolutionId],
);

export const getActiveSolutionsFiles = createSelector(
  [getActiveSolution, getFilesMap],
  (activeSolution, filesMap) => activeSolution.files.map(fileId => filesMap[fileId]),
);

export const getActiveFile = createSelector(
  [getActiveFileId, getFiles],
  (activeFileId, files) => files[activeFileId],
);

export const getActiveFileLanguage = createSelector(getActiveFile, activeFile =>
  convertExtensionToLanguage(activeFile.name),
);
