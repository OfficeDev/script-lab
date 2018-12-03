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

export const ThemeContext = React.createContext(getTheme(DEFAULT_HOST));

class Theme extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    initializeIcons();
    setupFabricTheme(props.host || DEFAULT_HOST);
    this.state = { theme: getTheme(props.host || DEFAULT_HOST) };
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.props.host !== prevProps.host) {
      setupFabricTheme(this.props.host);
      const theme = getTheme(this.props.host);
      this.setState({ theme });
    }
  }

  render() {
    return (
      <ThemeProvider theme={this.state.theme}>
        <ThemeContext.Provider value={this.state.theme}>
          {this.props.children}
        </ThemeContext.Provider>
      </ThemeProvider>
    );
  }
}

export default Theme;
