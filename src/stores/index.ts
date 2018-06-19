import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import selection from './selection'
import solutions from './solutions'
import files from './files'
import users from './users'
import ui from './ui'

import createSagas from '../sagas'

import { loadState, saveState } from './localStorage'

const sagaMiddleware = createSagaMiddleware()
const reducer = combineReducers({ selection, solutions, files, users, ui })

const persistedData = loadState()
const store = createStore(reducer, persistedData, applyMiddleware(sagaMiddleware))

store.subscribe(() => {
  console.log('store updated!')
  console.log(store.getState())
  saveState(store.getState())
})

sagaMiddleware.run(createSagas)

export default store
