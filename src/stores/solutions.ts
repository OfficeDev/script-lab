import { createAction, handleActions } from 'redux-actions'
import { getInitialSolutions } from '../storage'

// Types
export interface ISolution {
  id: string
  name: string
  description?: string
  date_created: number
  date_last_modified: number
  files: string[]
}

// Actions
export const addSolution = createAction('SOLUTION_ADD')
export const deleteSolution = createAction('SOLUTION_DELETE')

// State
const initialState = getInitialSolutions()

// Reducers
export default handleActions(
  {
    SOLUTION_ADD: (state, { payload }) => ({ ...state, [payload.id]: payload }),
    SOLUTION_DELETE: (state, { payload }) =>
      Object.keys(state)
        .filter(solId => solId !== payload)
        .map(solId => state[solId]),
  },
  {},
)

// Selectors
export const getSolutions = ({ solutions }) => Object.values(solutions)
export const getSolutionsMap = ({ solutions }) => solutions
