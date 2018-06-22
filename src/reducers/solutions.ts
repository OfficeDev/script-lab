import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { solutions, ISolutionsAction } from '../actions'

const normalizeSolutionName = (state, sol: ISolution): ISolution => {
  const allNames = Object.values(state)
    .filter((s: ISolution) => s.id !== sol.id)
    .map((s: ISolution) => s.name)

  let { name } = sol
  if (allNames.includes(name)) {
    name = name.replace(/\(\d+\)$/gm, '').trim()
    let suffix = 1
    while (allNames.includes(`${name} (${suffix})`)) {
      suffix++
    }
    name = `${name} (${suffix})`
  }

  return { ...sol, name }
}

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
      return {
        ...state,
        [action.payload.id]: normalizeSolutionName(state, action.payload),
      }

    case getType(solutions.edit):
      return {
        ...state,
        [action.payload.id]: normalizeSolutionName(
          state,
          solution(state[action.payload.id], action),
        ),
      }

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
