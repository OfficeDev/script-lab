import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { getTheme } from '../../theme';
import Heartbeat from '../Heartbeat';
import Header from './Header';
import MessageBar from './MessageBar';

import Snippet from '../Snippet';

export const Layout = styled.div`
  height: 100vh;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
`;

export const ContentContainer = styled.div`
  flex: 1 0 0;
  overflow: hidden;
`;

const RefreshBar = props => (
  <MessageBar
    message="The snippet has changed, would you like to refresh?"
    acceptMessage="Refresh"
    {...props}
  />
);

interface IState {
  solution: ISolution | null;
}

export class App extends React.Component<{}, IState> {
  constructor(props) {
    super(props);

    this.state = { solution: null };
  }

  onReceiveNewActiveSolution = (solution: ISolution) => this.setState({ solution });

  render() {
    console.log({ state: this.state });
    return (
      <ThemeProvider
        theme={getTheme(this.state.solution ? this.state.solution.host : 'POWERPOINT')}
      >
        <>
          <Layout>
            {/* <Header
              solutionName="example"
              host={this.state.solution ? this.state.solution.host : 'EXCEL'}
              goBack={() => {}}
            /> */}
            <RefreshBar isVisible={false} />
            <ContentContainer>
              {this.state.solution && <Snippet solution={this.state.solution!} />}
            </ContentContainer>
          </Layout>
          <Heartbeat onReceiveNewActiveSolution={this.onReceiveNewActiveSolution} />
        </>
      </ThemeProvider>
    );
  }
}

export default App;
