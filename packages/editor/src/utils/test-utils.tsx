import React, { ReactElement } from 'react';
import { render } from 'react-testing-library';
import { Provider } from 'react-redux';

import Theme from 'common/lib/components/Theme';
import configureStore from '../pages/Editor/store/configureStore';
import { IState } from '../pages/Editor/store/reducer';

export const renderWithTheme = node => {
  return render(<Theme host={'EXCEL'}>{node}</Theme>);
};

// re-export everything
export * from 'react-testing-library';

export const renderWithRedux = (
  ui: ReactElement<any>,
  { initialState }: { initialState: Partial<IState> },
) => {
  const store = configureStore({ initialState });
  return { ...renderWithTheme(<Provider store={store}>{ui}</Provider>), store };
};
