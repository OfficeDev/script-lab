// redux
import { createStore, applyMiddleware } from 'redux';
import rootReducer, { IState } from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

// saga
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';
import { ScriptLabError } from 'common/lib/utilities/error';

const addDevLoggingToDispatch = store => {
  const rawDispatch = store.dispatch;
  if (!console.group) {
    return rawDispatch;
  }
  return action => {
    if (!action) {
      invokeGlobalErrorHandler(
        new ScriptLabError('[Dev only] Unexpected error, action is undefined!'),
      );
      console.log('Previous state', store.getState());
    }

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
  initialState: Partial<IState>;
}

const configureStore = ({ initialState = {} }: IConfigureStoreProps) => {
  // UPDATE: https://github.com/ReactTraining/history/issues/509
  // it is office.js
  // TODO: (nicobell) find out why supportsHistory() says true for the agave window or use another condition
  // NOTE: editor/reducer will need to be updated as it currently is hardcoded to depend on window.location.hash
  // const history = supportsHistory() ? createBrowserHistory() : createHashHistory()
  const sagaMiddleware = createSagaMiddleware({
    onError: e => invokeGlobalErrorHandler(e),
  });

  const store = createStore(
    rootReducer,
    initialState as any,
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
  );
  sagaMiddleware.run(rootSaga);

  if (process.env.NODE_ENV !== 'production') {
    store.dispatch = addDevLoggingToDispatch(store);
  }

  return store;
};

export default configureStore;
