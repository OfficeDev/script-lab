import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { solutions, ISolutionsAction } from '../actions'

const solution = (state: ISolution, action: ISolutionsAction) => {
  switch (action.type) {
    case getType(solutions.edit):
      return { ...state, ...action.payload.solution }
    default:
      return state
  }
}

const byId = (state: { [id: string]: ISolution } = {}, action: ISolutionsAction) => {
  switch (action.type) {
    case getType(solutions.add):
      return { ...state, [action.payload.id]: action.payload }

    case getType(solutions.edit):
      return { ...state, [action.payload.id]: solution(state[action.payload.id], action) }

    case getType(solutions.remove):
      const { [action.payload]: omit, ...rest } = state
      return rest

    default:
      return state
  }
}

const allIds = (state: string[] = [], action: ISolutionsAction) => {
  switch (action.type) {
    case getType(solutions.add):
      return [...state, action.payload.id]

    case getType(solutions.remove):
      return state.filter(id => id !== action.payload)

    default:
      return state
  }
}

export default combineReducers({
  byId,
  allIds,
})

// selectors
export const selectors = {
  get: (state, id: string): ISolution | undefined => state.byId[id],
  getAll: (state): ISolution[] => Object.values(state.byId),
}
