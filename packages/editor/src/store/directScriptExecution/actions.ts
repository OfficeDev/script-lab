import { createAction, createAsyncAction } from 'typesafe-actions';

export const fetchMetadata = createAsyncAction(
  'DEFAULT_RUN_FETCH_METADATA_REQUEST',
  'DEFAULT_RUN_FETCH_METADATA_SUCCESS',
  'DEFAULT_RUN_FETCH_METADATA_FAILURE',
)<void, IDefaultSnippetRunMetadata[], Error>();

export const updateActiveSolutionMetadata = createAction(
  'DEFAULT_RUN_UPDATE_ACTIVE_SOLUTION_METADATA',
  resolve => {
    return (metadata: IDirectScriptExecutionFunctionMetadata[]) => resolve(metadata);
  },
);

export const runFunction = createAsyncAction(
  'DEFAULT_RUN_RUN_FUNCTION_REQUEST',
  'DEFAULT_RUN_RUN_FUNCTION_SUCCESS',
  'DEFAULT_RUN_RUN_FUNCTION_FAILURE',
)<
  { solutionId: string; fileId: string; functionName: string },
  { functionName: string; result: any },
  { functionName: string; error: Error }
>();

export const terminateAll = createAsyncAction(
  'DEFAULT_RUN_TERMINATE_ALL_REQUEST',
  'DEFAULT_RUN_TERMINATE_ALL_SUCCESS',
  'DEFAULT_RUN_TERMINATE_ALL_FAILURE',
)<void, void, Error>();
