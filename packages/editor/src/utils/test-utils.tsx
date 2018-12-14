import React from 'react';
import { render } from 'react-testing-library';
import { createStore } from 'redux';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';

import reducer, { IState as IReduxState } from '../pages/Editor/store/reducer';
import { ThemeProvider } from 'styled-components';
import { getTheme } from '../theme';
import Root from '../components/Root';
import configureStore from '../pages/Editor/store/configureStore';
const customRender = node => {
  return render(<ThemeProvider theme={getTheme('EXCEL')}>{node}</ThemeProvider>);
};

// re-export everything
export * from 'react-testing-library';

// override render method
export { customRender as render };

export function renderWithReduxAndRouter(ui, { initialState }) {
  const { store, history } = configureStore({ initialState });
  return {
    ...customRender(<Root store={store} history={history} ui={ui} />),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  };
}
