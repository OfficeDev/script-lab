import { IState } from '../reducer'
import { createSelector } from 'reselect'
import flatten from 'lodash/flatten'

export const getMetadata = (state: IState) => state.customFunctions.metadata
export const getMetadataSummaryItems: (
  state: IState,
) => ICustomFunctionSummaryItem[] = createSelector(
  [getMetadata],
  (metadata: ICFVisualSnippetMetadata[]) =>
    flatten(
      metadata
        .sort((a, b) => {
          if (a.status === 'error' && b.status !== 'error') {
            return -1
          } else if (a.status !== 'error' && b.status === 'error') {
            return 1
          } else {
            return 0
          }
        })
        .map(snippet => {
          const { name } = snippet
          return snippet.functions.map(({ funcName, status }) => ({
            snippetName: name,
            funcName,
            status,
          }))
        }),
    ),
)
