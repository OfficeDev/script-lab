import React, { Component } from 'react';
import { invokeGlobalErrorHandler } from '../../../utilities/splash.screen';

interface IProps {
  promise: Promise<any>;
  children: React.ReactNode;
}

interface IState {
  promiseHasResolved: boolean;
}

export class AwaitPromiseThenRender extends Component<IProps> {
  state: IState = { promiseHasResolved: false };
  constructor(props: IProps) {
    super(props);
    props.promise
      .then(() => this.setState({ promiseHasResolved: true }))
      .catch(e => invokeGlobalErrorHandler(e));
  }

  render() {
    const { children } = this.props;
    const { promiseHasResolved } = this.state;

    return promiseHasResolved ? children : null;
  }
}
