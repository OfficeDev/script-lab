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
  constructor(props) {
    super(props);
    initializeIcons();
    setupFabricTheme(props.host || DEFAULT_HOST);
    this.state = { theme: getTheme(props.host || DEFAULT_HOST) };
  }

  componentDidUpdate(prevProps: IProps) {
    console.log({ prevProps, props: this.props });

    if (this.props.host !== prevProps.host) {
      console.log('if w as true');
      setupFabricTheme(this.props.host);
      const theme = getTheme(this.props.host);
      console.log({ theme });
      this.setState({ theme });
    }
  }

  render() {
    console.log({ theme: this.state.theme, host: this.props.host });
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
