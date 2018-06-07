import { createStore, combineReducers } from 'redux'

import solutions from './solutions'

const reducer = combineReducers({ solutions })

export default createStore(reducer)
