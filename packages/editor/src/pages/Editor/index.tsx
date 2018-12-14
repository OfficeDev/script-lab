import React from 'react';
import IDE from './components';

import { connect } from 'react-redux';
import actions from '../../store/actions';

class Editor extends React.Component<{ initialize: () => void }> {
  constructor(props) {
    super(props);
    this.props.initialize();
  }

  render() {
    return <IDE />;
  }
}

export default connect(
  null,
  { initialize: actions.misc.initialize },
)(Editor);
