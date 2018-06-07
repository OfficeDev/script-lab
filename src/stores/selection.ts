import { createAction, handleActions } from 'redux-actions'
import { getInitialSelection } from '../storage'

// Actions
export const changeActiveSolution = createAction('SOLUTION_CHANGE_ACTIVE')
export const changeActiveFile = createAction('FILE_CHANGE_ACTIVE')

// State
interface ISelectionState {
  solutionId: string
  fileId: string
}

const initialState: ISelectionState = getInitialSelection()

// Reducers
export default handleActions(
  {
    SOLUTION_CHANGE_ACTIVE: (state, { payload }) => ({ ...state, solutionId: payload }),
    FILE_CHANGE_ACTIVE: (state, { payload }) => ({ ...state, fileId: payload }),
  },

  initialState,
)

// Selectors
export const getSolutions = state => state.solutions
