import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { supportsHistory } from 'history/es/DOMUtils'
import createBrowserHistory from 'history/createBrowserHistory'
import createHashHistory from 'history/createHashHistory'
import { loadState, saveState } from './localStorage'
import throttle from 'lodash/throttle'
import { composeWithDevTools } from 'redux-devtools-extension'

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
    console.groupEnd()
    return returnValue
  }
}

const configureStore = () => {
  // TODO: (nicobell) find out why supportsHistory() says true for the agave window or use another condition
  // const history = supportsHistory() ? createBrowserHistory() : createHashHistory()
  const history = createHashHistory()
  const sagaMiddleware = createSagaMiddleware()

  const persistedState = loadState()
  const store = createStore(
    connectRouter(history)(rootReducer),
    persistedState,
    composeWithDevTools(applyMiddleware(sagaMiddleware, routerMiddleware(history))),
  )
  sagaMiddleware.run(rootSaga)

  if (process.env.NODE_ENV !== 'production') {
    store.dispatch = addLoggingToDispatch(store)
  }

  store.subscribe(
    throttle(() => {
      saveState(store.getState())
    }, 1000),
  )

  return { store, history }
}

export default configureStore
