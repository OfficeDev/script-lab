import { createAction, handleActions } from 'redux-actions'

// Types
export interface ISolution {
  id: string
  name: string
  description?: string
  dateCreated: number
  dateLastModified: number
  files: string[]
}

// Actions
export const createNewSolution = createAction('SOLUTION_CREATE_NEW')
export const addSolution = createAction('SOLUTION_ADD')
export const deleteSolution = createAction('SOLUTION_DELETE')

// State
const initialState = {}

// Reducers
export default handleActions(
  {
    SOLUTION_ADD: (state, { payload }) => ({ ...state, [payload.id]: payload }),
    SOLUTION_DELETE: (state, { payload }) =>
      Object.keys(state)
        .filter(solId => solId !== payload)
        .map(solId => state[solId]),
  },
  initialState,
)

// Selectors
export const getSolutions = ({ solutions }) => Object.values(solutions)
export const getSolutionsMap = ({ solutions }) => solutions
