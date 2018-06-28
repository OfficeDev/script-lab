import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { solutions, ISolutionsAction, files, IFilesAction } from '../actions'

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

const solution = (state: ISolution, action: ISolutionsAction | IFilesAction) => {
  switch (action.type) {
    case getType(solutions.edit):
      return {
        ...state,
        ...action.payload.solution,
        dateLastModified: action.payload.timestamp,
      }
    case getType(files.edit):
      return { ...state, dateLastModified: action.payload.timestamp }
    default:
      return state
  }
}

interface IByIdState {
  [id: string]: ISolution
}

const byId = (state: IByIdState = {}, action: ISolutionsAction | IFilesAction) => {
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

    case getType(files.edit):
      return {
        ...state,
        [action.payload.solutionId]: solution(state[action.payload.solutionId], action),
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

export interface ISolutionsState {
  byId: IByIdState
  allIds: string[]
}

export default combineReducers({
  byId,
  allIds,
})

// selectors

const get = (state: ISolutionsState, id: string): ISolution | undefined => state.byId[id]

const getAll = (state: ISolutionsState): ISolution[] => Object.values(state.byId)

const getAllIds = (state: ISolutionsState): string[] => state.allIds

const getInLastModifiedOrder = (state: ISolutionsState): ISolution[] =>
  Object.values(state.byId).sort((a, b) => b.dateLastModified - a.dateLastModified)

export const selectors = {
  get,
  getAll,
  getAllIds,
  getInLastModifiedOrder,
}
