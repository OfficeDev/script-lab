import { createAction, handleActions } from 'redux-actions';
import { values } from 'lodash/values';
import { getInitialFiles } from '../storage';

import { getActiveSolution } from './selection';

// Types
interface IFile {
  id: number;
  name: string;
  date_created: number;
  date_last_modified: number;
  content: string;
}

// Actions
export const addFile = createAction('FILE_ADD');
export const deleteFile = createAction('FILE_DELETE');

// State
const initialState = getInitialFiles();

// Reducers
export default handleActions(
  {
    FILE_ADD: (state, { payload }) => [...state, payload],
    FILE_DELETE: (state, { payload }) => state.filter(sol => sol.id !== payload),
  },
  initialState,
);

// Selectors
export const getFiles = state => values(state.files);
export const getFilesMap = state => state.files;
