import React from 'react';
import styled from 'styled-components';

import Theme from 'common/lib/components/Theme';
import Heartbeat from '../Heartbeat';
import Header from './Header';
import MessageBar from '../MessageBar';

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
    Office.onReady(async () => {
      const loadingIndicator = document.getElementById('loading');
      if (loadingIndicator) {
        const { parentNode } = loadingIndicator;
        if (parentNode) {
          parentNode.removeChild(loadingIndicator);
        }
      }
      this.forceUpdate(); // TODO: is needed?
    });
  }

  onReceiveNewActiveSolution = (solution: ISolution) => this.setState({ solution });

  render() {
    return (
      <Theme host={this.state.solution ? this.state.solution.host : 'WEB'}>
        <>
          <Layout>
            <Header
              solutionName="Blank Snippet (1)"
              goBack={() => {}}
              refresh={() => {}}
            />

            <RefreshBar isVisible={false} />
            <ContentContainer>
              {this.state.solution && <Snippet solution={this.state.solution!} />}
            </ContentContainer>
          </Layout>
          <Heartbeat onReceiveNewActiveSolution={this.onReceiveNewActiveSolution} />
        </>
      </Theme>
    );
  }
}

export default App;
