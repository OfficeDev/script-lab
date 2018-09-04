import { IState } from '../reducer'
import { createSelector } from 'reselect'
import flatten from 'lodash/flatten'

import { getActiveSolution } from '../editor/selectors'
import { getAll as getAllSolutions } from '../solutions/selectors'

import { isCustomFunctionScript } from '../../utils/customFunctions'

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

export const getIsCurrentSolutionCF = (state: IState): boolean => {
  const solution = getActiveSolution(state)
  if (!solution) {
    return false
  }
  const script = solution.files.find(file => file.name === 'index.ts')
  if (script) {
    return isCustomFunctionScript(script.content)
  } else {
    return false
  }
}

export const getSolutions = (state: IState): ISolution[] =>
  getAllSolutions(state)
    .map(solution => {
      const script = solution.files.find(file => file.name === 'index.ts')
      return { solution, script }
    })
    .filter(({ script }) => script && isCustomFunctionScript(script.content))
    .map(({ solution }) => solution)
