import React from 'react';
import styled from 'styled-components';
import { Utilities } from '@microsoft/office-js-helpers';

import Theme from 'common/lib/components/Theme';
import Console, { ConsoleLogSeverities } from 'common/lib/components/Console';
import HeaderFooterLayout from 'common/lib/components/HeaderFooterLayout';
import Heartbeat from '../Heartbeat';
import Header from './Header';
import Footer from 'common/lib/components/Footer';
import MessageBar from '../MessageBar';

import Snippet from '../Snippet';

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
      <>
        <Theme host={this.state.solution ? this.state.solution.host : Utilities.host}>
          <HeaderFooterLayout
            header={
              <Header
                solutionName={this.state.solution ? this.state.solution.name : undefined}
                goBack={() => {}}
                refresh={() => window.location.reload()}
              />
            }
            footer={<Footer items={[]} />}
          >
            <RefreshBar isVisible={false} />
            {this.state.solution && <Snippet solution={this.state.solution!} />}
            {/* <Console
                logs={[
                  {
                    message: 'This is a test of an INFO message.',
                    severity: ConsoleLogSeverities.Info,
                  },
                  {
                    message: 'This is a test of a LOG message.',
                    severity: ConsoleLogSeverities.Log,
                  },
                  {
                    message: 'This is a test of a WARNING message.',
                    severity: ConsoleLogSeverities.Warn,
                  },
                  {
                    message: 'This is a test of an ERROR message.',
                    severity: ConsoleLogSeverities.Error,
                  },
                  {
                    message:
                      "This is a test of an ERROR message. Also, this error message happens to be very very long. Super long. It's only purpose is to be super long. So long that we can test that the log container properly resizes itself and shows all of this super important, meaningful text that will help us understand if this log will be readable by the user.",
                    severity: ConsoleLogSeverities.Error,
                  },
                ].map(log => ({ ...log, source: 'someSampleSource' }))}
                clearLogs={() => {}}
              /> */}
          </HeaderFooterLayout>
        </Theme>
        <Heartbeat onReceiveNewActiveSolution={this.onReceiveNewActiveSolution} />
      </>
    );
  }
}

export default App;
