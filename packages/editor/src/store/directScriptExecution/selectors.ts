import { IState } from '../reducer'

export const getMetadata = (state: IState): IDefaultSnippetRunMetadata[] =>
  state.directScriptExecution.metadata

export const getMetadataForActiveSolution = (
  state: IState,
): IDirectScriptExecutionFunctionMetadata[] =>
  Object.keys(state.directScriptExecution.metadataForActiveSolution).map(
    funcName => state.directScriptExecution.metadataForActiveSolution[funcName],
  )
