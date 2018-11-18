import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { initializeIcons } from 'office-ui-fabric-react/lib-commonjs/Icons';
import { getTheme, setupFabricTheme } from '../../theme';
import { DEFAULT_HOST } from '../../constants';

interface IProps {
  host: string;
  children: any;
}
interface IState {
  theme: ITheme;
}

class Theme extends Component<IProps, IState> {
  state;
  constructor(props) {
    super(props);
    initializeIcons();
    setupFabricTheme(DEFAULT_HOST);
    this.state = { theme: getTheme(DEFAULT_HOST) };
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.props.host !== prevProps.host) {
      setupFabricTheme(this.props.host);
      this.setState({ theme: getTheme(this.props.host) });
    }
  }

  render() {
    return <ThemeProvider theme={this.state.theme}>{this.props.children}</ThemeProvider>;
  }
}
