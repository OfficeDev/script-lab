import { IState } from '../reducer';
import {
  NULL_SOLUTION_ID,
  SETTINGS_SOLUTION_ID,
  SCRIPT_FILE_NAME,
  LIBRARIES_FILE_NAME,
} from '../../../../constants';
import { filterCustomFunctions } from '../../../CustomFunctions/components/App/utilities';

// solutions
export const get = (state: IState, id: string): ISolution | null => {
  const solutionMetadata = state.solutions.metadata[id];
  if (!solutionMetadata) {
    return null;
  }

  // TODO: Nico: REMOVE THIS LOGIC FROM HERE AS IT ISN'T THE RIGHT PLACE TO DO IT
  // https://github.com/OfficeDev/script-lab-react/issues/430
  const { isCustomFunctionsSolution, isDirectScriptExecution } = solutionMetadata.options;

  const shouldIncludeLibraries = (() => {
    const scriptFile = solutionMetadata.files
      .map(fileId => getFile(state, fileId))
      .filter(file => file.name === SCRIPT_FILE_NAME)[0];
    if (!scriptFile) {
      return false;
    }

    // For python, we don't support libraries. So don't include it if the script language is python.
    return scriptFile.language !== 'python';
  })();

  const files = solutionMetadata.files
    .map(fileId => getFile(state, fileId))
    .filter(file => {
      if (isCustomFunctionsSolution) {
        return [
          SCRIPT_FILE_NAME,
          ...(shouldIncludeLibraries ? [LIBRARIES_FILE_NAME] : []),
        ].includes(file.name);
      } else if (isDirectScriptExecution) {
        return file.name === SCRIPT_FILE_NAME;
      } else {
        return true;
      }
    });

  return { ...solutionMetadata, files };
};

// TODO: Nico: REMOVE THIS LOGIC FROM HERE AS IT ISN'T THE RIGHT PLACE TO DO IT
// https://github.com/OfficeDev/script-lab-react/issues/430
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
  Object.values(state.solutions.metadata)
    .filter(solution => solution.host === state.host || solution.host === 'ALL')
    .filter(({ id }) => ![NULL_SOLUTION_ID, SETTINGS_SOLUTION_ID].includes(id))
    .map(solution => ({
      ...solution,
      files: solution.files.map(id => getFile(state, id)),
    }));

export const getInLastModifiedOrder = (state: IState): ISolution[] =>
  getAll(state).sort((a, b) => b.dateLastModified - a.dateLastModified);

export const getInLastOpenedOrder = (state: IState): ISolution[] =>
  getAll(state).sort((a, b) => b.dateLastOpened - a.dateLastOpened);

// NOTE: might need to make a getLastModifiedCustomFunctionSolution or something of that nature
//       that filters for only custom functions to prevent false positive refreshes
export const getEditorLastModifiedDate = (state: IState): number => {
  const lastModifiedOrderSolutions = getInLastModifiedOrder(state);
  return lastModifiedOrderSolutions.length > 0
    ? lastModifiedOrderSolutions[0].dateLastModified
    : 0;
};

export const getCustomFunctionsLastModifiedDate = (state: IState): number => {
  const lastModifiedCFSolutions = filterCustomFunctions(getInLastModifiedOrder(state));

  return lastModifiedCFSolutions.length > 0
    ? lastModifiedCFSolutions[0].dateLastModified
    : 0;
};

// files
export const getFile = (state: IState, id: string): IFile => state.solutions.files[id];
export const getFiles = (state: IState, ids: string[]): IFile[] =>
  ids.map(id => getFile(state, id));
