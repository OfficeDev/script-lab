import React from 'react';
import { render } from 'react-testing-library';

import Theme from 'common/lib/components/Theme';
import configureStore from '../pages/Editor/store/configureStore';
import { Provider } from 'react-redux';

export const renderWithTheme = node => {
  return render(<Theme host={'EXCEL'}>{node}</Theme>);
};

// re-export everything
export * from 'react-testing-library';

export const renderWithRedux = (ui, { initialState }) => {
  const store = configureStore({ initialState });
  return { ...renderWithTheme(<Provider store={store}>{ui}</Provider>), store };
};
