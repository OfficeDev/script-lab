import { IState } from '../reducer'
import {
  get as getSolution,
  getInLastModifiedOrder as getSolutionsInLastModifiedOrder,
} from '../solutions/selectors'

export const getActiveSolution = (state: IState): ISolution | undefined => {
  return state.editor.active.solutionId
    ? getSolution(state, state.editor.active.solutionId)
    : undefined
}

// NOTE: might need to make a getLastModifiedCustomFunctionSolution or something of that nature
//       that filters for only custom functions to prevent false positive refreshes
export const getLastModifiedDate = (state: IState): number => {
  const lastModifiedOrderSolutions = getSolutionsInLastModifiedOrder(state)
  return lastModifiedOrderSolutions.length > 0
    ? lastModifiedOrderSolutions[0].dateLastModified
    : 0
}

export const getActiveFile = (state: IState): IFile | undefined => {
  const activeSolution = getActiveSolution(state)

  return activeSolution
    ? activeSolution.files.find(file => file.id === state.editor.active.fileId)
    : undefined
}
