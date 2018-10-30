import { IState } from '../reducer'

export const getMetadata = (state: IState): IDefaultSnippetRunMetadata[] =>
  state.defaultRun.metadata

export const getMetadataForActiveSolution = (
  state: IState,
): IDefaultFunctionRunMetadata[] => state.defaultRun.metadataForActiveSolution
export const getIsDefaultRunSolution = (state: IState): boolean =>
  getMetadataForActiveSolution(state).length > 0
