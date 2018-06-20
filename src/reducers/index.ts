import { combineReducers } from 'redux'

// reducers
import solutions from './solutions'

const root = combineReducers({
  solutions,
})

export default root

// global state selectors
