import { createAction, handleActions } from 'redux-actions'

// Actions
export const hideBackstage = createAction('BACKSTAGE_HIDE')
export const showBackstage = createAction('BACKSTAGE_SHOW')

// State
interface IUIState {
  isBackstageVisible: boolean
}

const initialState: IUIState = { isBackstageVisible: false }

// Reducers
export default handleActions(
  {
    BACKSTAGE_HIDE: state => ({ ...state, isBackstageVisible: false }),
    BACKSTAGE_SHOW: state => ({ ...state, isBackstageVisible: true }),
  },
  initialState,
)

// Selectors
export const getIsBackstageVisible = state => state.ui.isBackstageVisible
