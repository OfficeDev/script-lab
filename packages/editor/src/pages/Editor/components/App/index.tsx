import React from 'react';
import { IState as IReduxState } from '../../store/reducer';
import { connect } from 'react-redux'; // Note, avoid the temptation to include '@types/react-redux', it will break compile-time!

import Theme from 'common/lib/components/Theme';
import Only from 'common/lib/components/Only';

import Main from '../Main';
import Backstage from '../Backstage';
import ScreenSizeMonitor from '../ScreenSizeMonitor';

import { actions, selectors } from '../../store';
import BrowserAuthDialog from '../Main/Header/BrowserAuthDialog';

interface IProps {
  isBackstageVisible: boolean;
  host: string;
  initialize();
}

class IDE extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.props.initialize();
  }

  render() {
    const { isBackstageVisible, host } = this.props;
    return (
      <Theme host={host}>
        <Only when={isBackstageVisible}>
          <Backstage />
        </Only>
        <Main />
        <ScreenSizeMonitor />
        <BrowserAuthDialog />
      </Theme>
    );
  }
}

export default connect(
  (state: IReduxState) => ({
    host: selectors.host.get(state),
    isBackstageVisible: state.editor.isBackstageVisible,
  }),
  { initialize: actions.misc.initialize },
)(IDE);
