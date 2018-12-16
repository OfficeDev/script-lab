import React from 'react';
import { render } from 'react-testing-library';

import { Provider } from 'react-redux';

import Theme from 'common/lib/components/Theme';

import configureStore from '../pages/Editor/store/configureStore';

const customRender = node => {
  return render(<Theme host={'EXCEL'}>{node}</Theme>);
};

// re-export everything
export * from 'react-testing-library';

// override render method
export { customRender as render };

export function renderWithReduxAndRouter(ui, { initialState }) {
  const store = configureStore({ initialState });
  return {
    ...customRender(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  };
}
