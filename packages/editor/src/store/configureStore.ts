// redux
import { createStore, applyMiddleware } from 'redux';
import rootReducer, { IState } from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

// saga
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';

// router
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { supportsHistory } from 'history/es/DOMUtils';
import createMemoryHistory from 'history/createMemoryHistory';
import createHashHistory from 'history/createHashHistory';

import actions from './actions';

const addLoggingToDispatch = store => {
  const rawDispatch = store.dispatch;
  if (!console.group) {
    return rawDispatch;
  }
  return action => {
    console.group(action.type);
    console.log('%c prev state', 'color: gray', store.getState());
    console.log('%c action', 'color: blue', action);
    const returnValue = rawDispatch(action);
    console.log('%c next state', 'color: green', store.getState());
    console.groupEnd();
    return returnValue;
  };
};

export interface IConfigureStoreProps {
  history?: any;
  initialState: Partial<IState>;
}

const configureStore = ({
  history = createMemoryHistory(),
  initialState = {},
}: IConfigureStoreProps) => {
  // TODO: (nicobell) find out why supportsHistory() says true for the agave window or use another condition
  // NOTE: editor/reducer will need to be updated as it currently is hardcoded to depend on window.location.hash
  // const history = supportsHistory() ? createBrowserHistory() : createHashHistory()
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore<IState>(
    connectRouter(history)(rootReducer),
    initialState as any,
    composeWithDevTools(applyMiddleware(sagaMiddleware, routerMiddleware(history))),
  );
  sagaMiddleware.run(rootSaga);

  if (process.env.NODE_ENV !== 'production') {
    store.dispatch = addLoggingToDispatch(store);
  }

  return { store, history };
};

export default configureStore;
