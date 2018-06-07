import { createAction, handleActions } from 'redux-actions'
import { getInitialUsers } from '../storage'

// Types
interface ISolution {
  id: string
  name: string
  date_created: number
  date_last_modified: number
  files: string[]
}

// Actions
export const addSolution = createAction('USER_ADD')
export const deleteSolution = createAction('USER_DELETE')

// State
const initialState = getInitialUsers()

// Reducers
export default handleActions(
  {
    USER_ADD: (state, action) => [...state, action.payload],
    USER_DELETE: (state, action) => state.filter(user => user.id !== action.payload),
  },
  initialState,
)

// Selectors
export const getUsers = state => state
