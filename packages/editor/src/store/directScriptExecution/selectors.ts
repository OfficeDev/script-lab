import { IState } from '../reducer'

export const getMetadata = (state: IState): IDefaultSnippetRunMetadata[] =>
  state.directScriptExecution.metadata

export const getMetadataForActiveSolution = (
  state: IState,
): IDefaultFunctionRunMetadata[] =>
  Object.keys(state.directScriptExecution.metadataForActiveSolution).map(
    funcName => state.directScriptExecution.metadataForActiveSolution[funcName],
  )
export const getIsDirectScriptExecutionSolution = (state: IState): boolean =>
  getMetadataForActiveSolution(state).length > 0
