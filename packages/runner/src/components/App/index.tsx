import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { getTheme } from '../../theme';

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
  heartbeat: HTMLIFrameElement | null;
  pollingInterval;
  state = { solution: null };

  componentDidMount() {
    this.pollingInterval = setInterval(() => {
      this.requestActiveSolution();
    }, 1000);

    this.setActiveSolutionListener();
  }

  componentWillUnmount() {
    clearInterval(this.pollingInterval);
    window.onmessage = null;
  }

  requestActiveSolution = () => {
    if (this.heartbeat) {
      this.heartbeat.contentWindow!.postMessage('GET_ACTIVE_SOLUTION', '*');
    }
  };

  setActiveSolutionListener = () => {
    window.onmessage = ({ origin, data }) => {
      if (origin === 'http://localhost:3000') {
        this.setState({ solution: JSON.parse(data) });
      }
    };
  };

  render() {
    console.log({ state: this.state });
    return (
      <ThemeProvider theme={getTheme('EXCEL')}>
        <>
          <Layout>
            <Header
              solutionName="example"
              goBack={() => {}}
              refresh={this.requestActiveSolution}
            />
            <RefreshBar isVisible={false} />
            <ContentContainer>
              {this.state.solution && <Snippet solution={this.state.solution!} />}
            </ContentContainer>
          </Layout>
          <iframe
            style={{ display: 'none' }}
            src="http://localhost:3000/heartbeat.html"
            ref={heartbeat => (this.heartbeat = heartbeat)}
          />
        </>
      </ThemeProvider>
    );
  }
}

export default App;
