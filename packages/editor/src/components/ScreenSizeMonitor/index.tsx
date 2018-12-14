import React from 'react';

import { connect } from 'react-redux';
import actions, { IRootAction } from '../../pages/Editor/store/actions';
import { Dispatch } from 'redux';

interface IActionsFromRedux {
  updateSize: (width: number, height: number) => void;
}

const mapDispatchToProps = (dispatch: Dispatch<IRootAction>): IActionsFromRedux => ({
  updateSize: (width: number, height: number) =>
    dispatch(actions.screen.updateSize({ width, height })),
});

interface IProps extends IActionsFromRedux {}

export class ScreenSizeMonitor extends React.Component<IProps> {
  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => this.props.updateSize(window.innerWidth, window.innerHeight);

  render() {
    return null;
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(ScreenSizeMonitor);
