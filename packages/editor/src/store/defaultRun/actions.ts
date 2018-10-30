import { createAction, createAsyncAction } from 'typesafe-actions'

export const fetchMetadata = createAsyncAction(
  'DEFAULT_RUN_FETCH_METADATA_REQUEST',
  'DEFAULT_RUN_FETCH_METADATA_SUCCESS',
  'DEFAULT_RUN_FETCH_METADATA_FAILURE',
)<void, IDefaultSnippetRunMetadata[], Error>()

export const updateActiveSolutionMetadata = createAction(
  'UPDATE_ACTIVE_SOLUTION_METADATA',
  resolve => {
    return (metadata: IDefaultFunctionRunMetadata[]) => resolve(metadata)
  },
)

export const runFunction = createAction('DEFAULT_RUN_RUN_FUNCTION', resolve => {
  return (props: { solutionId: string; fileId: string; functionName: string }) =>
    resolve(props)
})
