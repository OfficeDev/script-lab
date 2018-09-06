import { IState } from '../reducer'
import { createSelector } from 'reselect'
import flatten from 'lodash/flatten'

import { getActiveSolution } from '../editor/selectors'
import {
  getAll as getAllSolutions,
  getInLastModifiedOrder as getSolutionsInLastModifiedOrder,
} from '../solutions/selectors'

import { isCustomFunctionScript } from '../../utils/customFunctions'
import { PATHS } from '../../constants'

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
          return snippet.functions.map(({ funcName, status, parameters, result }) => {
            let additionalInfo
            if (status === 'error') {
              additionalInfo = []
              parameters.forEach(({ name, error }) => {
                if (error) {
                  additionalInfo.push(`${name} - ${error}`)
                }
              })
              if (result.error) {
                additionalInfo.push(`Result - ${result.error}`)
              }
            }
            return {
              snippetName: name,
              funcName,
              status,
              additionalInfo,
            }
          })
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

const filterCustomFunctions = (solutions: ISolution[]): ISolution[] => {
  return solutions
    .map(solution => {
      const script = solution.files.find(file => file.name === 'index.ts')
      return { solution, script }
    })
    .filter(({ script }) => script && isCustomFunctionScript(script.content))
    .map(({ solution }) => solution)
}

export const getSolutions = (state: IState): ISolution[] =>
  filterCustomFunctions(getAllSolutions(state))

export const getLastModifiedDate = (state: IState): number => {
  const solutions = filterCustomFunctions(getSolutionsInLastModifiedOrder(state))
  console.log({ solutions })
  return solutions.length > 0 ? solutions[0].dateLastModified : 0
}

// export const getShouldPromptRefresh = createSelector(
//   [getLastModifiedDate, state => state.customFunctions.runner.lastUpdated],
//   (lastModified: number, lastUpdated: number): boolean => {
//     return lastModified > lastUpdated
//   },
// )

// export const getShouldPromptRefresh = (state: IState): boolean =>
//   getLastModifiedDate(state) > state.customFunctions.runner.lastUpdated

export const getHasCustomFunctions = createSelector(
  getSolutions,
  (solutions: ISolution[]) => solutions.length > 0,
)

export const getIsStandalone = (state: IState): boolean =>
  state.router.location.pathname === PATHS.CUSTOM_FUNCTIONS_DASHBOARD
