import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { solutions, ISolutionsAction, files, IFilesAction } from '../actions'
import { SETTINGS_SOLUTION_ID } from '../constants'

const normalizeSolutionName = (state, sol: ISolution): ISolution => {
  const allNames = Object.keys(state)
    .map(k => state[k])
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
      if (Array.isArray(action.payload)) {
        return {
          ...state,
          ...action.payload.reduce((solutionsMap, s) => {
            solutionsMap[s.id] = s
            return solutionsMap
          }, {}),
        }
      } else {
        return {
          ...state,
          [action.payload.id]: normalizeSolutionName(state, action.payload),
        }
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
      const { [action.payload.id]: omit, ...rest } = state
      return rest

    default:
      return state
  }
}

const allIds = (state: string[] = [], action: ISolutionsAction) => {
  switch (action.type) {
    case getType(solutions.add):
      if (Array.isArray(action.payload)) {
        return [...state, ...action.payload.map(s => s.id)]
      } else {
        return [...state, action.payload.id]
      }

    case getType(solutions.remove):
      return state.filter(id => id !== action.payload.id)

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

const getAll = (state: ISolutionsState): ISolution[] =>
  Object.keys(state.byId).map(k => state.byId[k])

const getAllExceptSettings = (state: ISolutionsState): ISolution[] =>
  Object.keys(state.byId)
    .filter(k => k !== SETTINGS_SOLUTION_ID)
    .map(k => state.byId[k])

const getGists = (state: ISolutionsState): ISolution[] =>
  Object.keys(state.byId)
    .map(k => state.byId[k])
    .filter(sol => sol.source && sol.source.origin === 'gist')

const getAllIds = (state: ISolutionsState): string[] => state.allIds

const getInLastModifiedOrder = (state: ISolutionsState): ISolution[] =>
  getAllExceptSettings(state).sort((a, b) => b.dateLastModified - a.dateLastModified)

export const selectors = {
  get,
  getAll,
  getAllExceptSettings,
  getGists,
  getAllIds,
  getInLastModifiedOrder,
}
