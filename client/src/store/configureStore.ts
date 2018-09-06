// redux
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  loadState as loadStateFromLocalStorage,
  saveState as saveStateToLocalStorage,
} from './localStorage'
import {
  loadState as loadStateFromSessionStorage,
  saveState as saveStateToSessionStorage,
} from './sessionStorage'

// saga
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'

// router
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { supportsHistory } from 'history/es/DOMUtils'
import createBrowserHistory from 'history/createBrowserHistory'
import createHashHistory from 'history/createHashHistory'

// utilities
import throttle from 'lodash/throttle'

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
    console.groupEnd()
    return returnValue
  }
}

const configureStore = () => {
  // TODO: (nicobell) find out why supportsHistory() says true for the agave window or use another condition
  // NOTE: editor/reducer will need to be updated as it currently is hardcoded to depend on window.location.hash
  // const history = supportsHistory() ? createBrowserHistory() : createHashHistory()
  const history = createHashHistory()
  const sagaMiddleware = createSagaMiddleware()

  const persistedState = {
    ...loadStateFromLocalStorage(),
    ...loadStateFromSessionStorage(),
  }
  const store = createStore(
    connectRouter(history)(rootReducer),
    persistedState as any,
    composeWithDevTools(applyMiddleware(sagaMiddleware, routerMiddleware(history))),
  )
  sagaMiddleware.run(rootSaga)

  if (process.env.NODE_ENV !== 'production') {
    store.dispatch = addLoggingToDispatch(store)
  }

  store.subscribe(
    throttle(() => {
      const state = store.getState()
      saveStateToLocalStorage(state)
      saveStateToSessionStorage(state)
    }, 1000),
  )

  return { store, history }
}

export default configureStore
