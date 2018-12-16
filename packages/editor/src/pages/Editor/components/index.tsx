import React from 'react';

import Theme from 'common/lib/components/Theme';

import ScreenSizeMonitor from './ScreenSizeMonitor';
import App from './App';
import { connect } from 'react-redux';
import { IState as IReduxState } from '../store/reducer';
import selectors from '../store/selectors';

export default connect((state: IReduxState) => ({ host: selectors.host.get(state) }))(
  ({ host }: { host: string }) => (
    <Theme host={host}>
      <ScreenSizeMonitor />
      <App />
    </Theme>
  ),
);
