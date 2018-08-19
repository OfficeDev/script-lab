import pathToRegexp from 'path-to-regexp'
import { IState } from '../reducer'
import { getObjectValues } from '../../utils'
import { SETTINGS_SOLUTION_ID } from '../../constants'

const solutionPathRegex = pathToRegexp('/:solutionId?/:fileId?')

// solutions
export const get = (state: IState, id: string): ISolution => {
  const solutionMetadata = state.solutions.metadata[id]
  const files = solutionMetadata.files.map(fileId => getFile(state, fileId))
  return { ...solutionMetadata, files }
}

export const getAll = (state: IState): ISolution[] =>
  getObjectValues(state.solutions.metadata)
    .filter(solution => solution.host === state.host || solution.host === 'ALL')
    .filter(({ id }) => id !== SETTINGS_SOLUTION_ID)
    .map(solution => ({
      ...solution,
      files: solution.files.map(id => getFile(state, id)),
    }))

export const getInLastModifiedOrder = (state: IState): ISolution[] =>
  getAll(state).sort((a, b) => b.dateLastModified - a.dateLastModified)

export const getActive = (state: IState): ISolution | undefined => {
  const [path, pathSolutionId, pathFileId] = solutionPathRegex.exec(
    state.router.location.pathname,
  )
  const allSolutions = getInLastModifiedOrder(state)

  if (allSolutions.length > 0) {
    const allSolutionIds = getObjectValues(state.solutions.metadata)
      .filter(solution => solution.host === state.host || solution.host === 'ALL')
      .map(solution => solution.id)

    return allSolutionIds.includes(pathSolutionId)
      ? get(state, pathSolutionId)
      : allSolutions[0]
  } else {
    return undefined
  }
}

// files
export const getFile = (state: IState, id: string): IFile => state.solutions.files[id]
export const getFiles = (state: IState, ids: string[]): IFile[] =>
  ids.map(id => getFile(state, id))

export const getActiveFile = (state: IState): IFile | undefined => {
  const [path, pathSolutionId, pathFileId] = solutionPathRegex.exec(
    state.router.location.pathname,
  )

  const activeSolution = getActive(state)
  if (activeSolution) {
    console.log({ activeSolution, files: activeSolution.files, pathSolutionId })
    console.log(activeSolution.files.find(file => file.id === pathFileId))
    return (
      activeSolution.files.find(file => file.id === pathFileId) || activeSolution.files[0]
    )
  } else {
    return undefined
  }
}
