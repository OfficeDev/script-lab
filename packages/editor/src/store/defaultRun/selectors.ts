import { IState } from '../reducer'

export const getMetadata = (state: IState): IDefaultSnippetRunMetadata[] =>
  state.defaultRun.metadata

export const getMetadataForActiveSolution = (
  state: IState,
): IDefaultFunctionRunMetadata[] =>
  Object.keys(state.defaultRun.metadataForActiveSolution).map(
    funcName => state.defaultRun.metadataForActiveSolution[funcName],
  )
export const getIsDefaultRunSolution = (state: IState): boolean =>
  getMetadataForActiveSolution(state).length > 0
