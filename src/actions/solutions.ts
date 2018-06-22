import { createAction } from 'typesafe-actions'
import uuidv4 from 'uuid'
import { add as addFiles } from './files'
import { push } from 'connected-react-router'
import { getBoilerplateSolution, getBoilerplateFiles } from '../newSolutionData'

export const add = createAction('SOLUTIONS_ADD', resolve => {
  return (solution: ISolution) => resolve(solution)
})

export const edit = createAction('SOLUTIONS_EDIT', resolve => {
  return (id: string, solution: Partial<IEditableSolutionProperties>) =>
    resolve({ id, solution })
})

export const remove = createAction('SOLUTIONS_REMOVE', resolve => {
  return (id: string) => resolve(id)
})

export const create = () => dispatch => {
  const files = getBoilerplateFiles()
  const solution = getBoilerplateSolution(files)

  dispatch(addFiles(files))
  dispatch(add(solution))
  dispatch(push(`/edit/${solution.id}`))
}
