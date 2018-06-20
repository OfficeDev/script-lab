import { loadState, saveState } from './localStorage'
import { createStore } from 'redux'
import { throttle } from 'lodash/throttle'

import rootReducer from './reducers'

const addLoggingToDispatch = store => {
  const rawDispatch = store.dispatch
  if (!console.group) {
    return rawDispatch
  }
  return action => {
    console.group(action.type)
    console.log('%c prev state', 'color: gray', store.getState())
    console.log('%c action', 'color: blue', action)
    const returnValue = rawDispatch(action)
    console.log('%c next state', 'color: green', store.getState())
    return returnValue
  }
}

const configureStore = () => {
  const persistedState = loadState()
  const store = createStore(rootReducer, persistedState)

  if (process.env.NODE_ENV !== 'production') {
    store.dispatch = addLoggingToDispatch(store)
  }

  store.subscribe(
    throttle(() => {
      saveState(store.getState())
    }, 1000),
  )
}

export default configureStore
