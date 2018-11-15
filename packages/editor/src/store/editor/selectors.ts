import { IState } from '../reducer';
import {
  get as getSolution,
  getSolutionWithHiddenFiles,
  getInLastModifiedOrder as getSolutionsInLastModifiedOrder,
} from '../solutions/selectors';
import { NULL_SOLUTION, NULL_SOLUTION_ID, NULL_FILE } from '../../constants';

export const getActiveSolution = (
  state: IState,
  withHiddenFiles: boolean = false,
): ISolution => {
  const activeSolutionId = state.editor.active.solutionId;
  if (activeSolutionId) {
    const getter = withHiddenFiles ? getSolution : getSolutionWithHiddenFiles;
    const solution = getter(state, activeSolutionId);
    if (solution) {
      return solution;
    }
  }

  return NULL_SOLUTION;
};

// NOTE: might need to make a getLastModifiedCustomFunctionSolution or something of that nature
//       that filters for only custom functions to prevent false positive refreshes
export const getLastModifiedDate = (state: IState): number => {
  const lastModifiedOrderSolutions = getSolutionsInLastModifiedOrder(state);
  return lastModifiedOrderSolutions.length > 0
    ? lastModifiedOrderSolutions[0].dateLastModified
    : 0;
};

export const getActiveFile = (state: IState): IFile => {
  const activeSolution = getActiveSolution(state);

  const activeFile = activeSolution.files.find(
    file => file.id === state.editor.active.fileId,
  );

  if (activeFile) {
    return activeFile;
  } else if (!activeFile && activeSolution.files.length > 0) {
    return activeSolution.files[0];
  } else {
    return NULL_FILE;
  }
};

export const getIntellisenseFiles = (
  state: IState,
): { [url: string]: monaco.IDisposable } => state.editor.intellisenseFiles;
