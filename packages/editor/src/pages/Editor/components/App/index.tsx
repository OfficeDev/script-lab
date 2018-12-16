import React, { useEffect } from 'react';
import { IState as IReduxState } from '../../store/reducer';
import { connect } from 'react-redux';

import Only from 'common/lib/components/Only';
import Main from '../Main';
import Backstage from '../Backstage'; // TODO: (nicobell): move backstage to IDE folder
import { actions } from '../../store';

interface IProps {
  isBackstageVisible: boolean;
  initialize();
}

class IDE extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.props.initialize();
  }

  render() {
    const { isBackstageVisible } = this.props;
    return (
      <>
        <Only when={isBackstageVisible}>
          <Backstage />
        </Only>
        <Main />
      </>
    );
  }
}

export default connect(
  (state: IReduxState) => ({
    isBackstageVisible: state.editor.isBackstageVisible,
  }),
  { initialize: actions.misc.initialize },
)(IDE);
