import React, { Component } from 'react';

export class RunOnLoad extends Component<{ funcToRun() }> {
  constructor(props: { funcToRun() }) {
    super(props);
    this.props.funcToRun();
  }
  render() {
    return null;
  }
}
