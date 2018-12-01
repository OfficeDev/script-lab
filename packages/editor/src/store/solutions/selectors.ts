import { IState } from '../reducer';
import { getObjectValues } from '../../utils';
import {
  NULL_SOLUTION_ID,
  SETTINGS_SOLUTION_ID,
  SCRIPT_FILE_NAME,
  LIBRARIES_FILE_NAME,
} from '../../constants';

// solutions
export const get = (state: IState, id: string): ISolution | null => {
  const solutionMetadata = state.solutions.metadata[id];
  if (!solutionMetadata) {
    return null;
  }

  const { isCustomFunctionsSolution, isDirectScriptExecution } = solutionMetadata.options;
  const files = solutionMetadata.files
    .map(fileId => getFile(state, fileId))
    .filter(file => {
      if (isCustomFunctionsSolution) {
        return [SCRIPT_FILE_NAME, LIBRARIES_FILE_NAME].includes(file.name);
      } else if (isDirectScriptExecution) {
        return file.name === SCRIPT_FILE_NAME;
      } else {
        return true;
      }
    });

  return { ...solutionMetadata, files };
};

export const getSolutionWithHiddenFiles = (
  state: IState,
  id: string,
): ISolution | null => {
  const solutionMetadata = state.solutions.metadata[id];
  if (!solutionMetadata) {
    return null;
  }
  const files = solutionMetadata.files.map(fileId => getFile(state, fileId));

  return { ...solutionMetadata, files };
};

export const getAll = (state: IState): ISolution[] =>
  getObjectValues(state.solutions.metadata)
    .filter(solution => solution.host === state.host || solution.host === 'ALL')
    .filter(({ id }) => ![NULL_SOLUTION_ID, SETTINGS_SOLUTION_ID].includes(id))
    .map(solution => ({
      ...solution,
      files: solution.files.map(id => getFile(state, id)),
    }));

export const getInLastModifiedOrder = (state: IState): ISolution[] =>
  getAll(state).sort((a, b) => b.dateLastModified - a.dateLastModified);

// NOTE: might need to make a getLastModifiedCustomFunctionSolution or something of that nature
//       that filters for only custom functions to prevent false positive refreshes
export const getEditorLastModifiedDate = (state: IState): number => {
  const lastModifiedOrderSolutions = getInLastModifiedOrder(state);
  return lastModifiedOrderSolutions.length > 0
    ? lastModifiedOrderSolutions[0].dateLastModified
    : 0;
};

// files
export const getFile = (state: IState, id: string): IFile => state.solutions.files[id];
export const getFiles = (state: IState, ids: string[]): IFile[] =>
  ids.map(id => getFile(state, id));
