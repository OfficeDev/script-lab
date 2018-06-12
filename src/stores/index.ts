import { createStore, combineReducers } from 'redux'

import selection from './selection'
import solutions from './solutions'
import files from './files'
import users from './users'

import { normalize } from 'normalizr'
import sampleSolution from '../sampleData'
import { solution } from '../storage/schema'
import { loadState, saveState } from './localStorage'

const { entities } = normalize(sampleSolution, solution)
console.log(entities)
const reducer = combineReducers({ selection, solutions, files, users })

const persistedData = loadState()
const store = createStore(reducer, persistedData)

store.subscribe(() => {
  saveState(store.getState())
})

export default store
