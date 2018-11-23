import React from 'react';
import styled from 'styled-components';
import { Utilities } from '@microsoft/office-js-helpers';

import Theme from 'common/lib/components/Theme';
import Console, { ConsoleLogSeverities } from 'common/lib/components/Console';
import HeaderFooterLayout from 'common/lib/components/HeaderFooterLayout';
import Heartbeat from '../Heartbeat';
import Header from './Header';
import Footer from 'common/lib/components/Footer';
import Only from 'common/lib/components/Only';
import MessageBar from '../MessageBar';

import Snippet from '../Snippet';

const AppWrapper = styled.div`
  height: 100vh;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
  logs: ILogData[];
  isConsoleOpen: boolean;
}

export class App extends React.Component<{}, IState> {
  constructor(props) {
    super(props);

    this.state = { solution: null, logs: [], isConsoleOpen: false };
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

  componentDidMount() {
    this.portConsole();
  }

  portConsole = () => {
    ['info', 'warn', 'error', 'log'].forEach(method => {
      const oldMethod = window.console[method];
      window.console[method] = (...args) => {
        oldMethod(...args);
        try {
          const message =
            typeof args[0] !== 'string' ? JSON.stringify(args[0], null, 2) : args[0];

          setTimeout(
            () =>
              this.addLog({
                severity: method as ConsoleLogTypes,
                message,
              }),
            0,
          );
        } catch (error) {
          // this is a quickfix to prevent
          // Uncaught TypeError: Converting circular structure to JSON
          // from being thown
        }
      };
    });
  };

  addLog = (log: ILogData) =>
    this.setState({ logs: [...this.state.logs, log], isConsoleOpen: true });
  clearLogs = () => this.setState({ logs: [] });

  openConsole = () => this.setState({ isConsoleOpen: true });
  closeConsole = () => this.setState({ isConsoleOpen: false });

  onReceiveNewActiveSolution = (solution: ISolution) => this.setState({ solution });

  render() {
    // console.info(this.state);
    return (
      <Theme host={this.state.solution ? this.state.solution.host : Utilities.host}>
        <AppWrapper>
          <HeaderFooterLayout
            wrapperStyle={{ flex: '7' }}
            header={
              <Header
                solutionName={this.state.solution ? this.state.solution.name : undefined}
                goBack={() => {}}
                refresh={() => window.location.reload()}
                hardRefresh={() => window.location.reload()}
              />
            }
            footer={
              <Footer
                items={[]}
                farItems={[
                  {
                    hidden: this.state.isConsoleOpen || this.state.solution === null,
                    key: 'open-console',
                    text: 'Open Console',
                    iconProps: {
                      iconName: 'CaretSolidUp',
                      styles: { root: { fontSize: '1.2rem' } },
                    },
                    onClick: this.openConsole,
                  },
                  {
                    hidden: !this.state.isConsoleOpen || this.state.solution === null,
                    key: 'close-console',
                    text: 'Close Console',
                    iconProps: {
                      iconName: 'CaretSolidDown',
                      styles: { root: { fontSize: '1.2rem' } },
                    },
                    onClick: this.closeConsole,
                  },
                ]}
              />
            }
          >
            <RefreshBar isVisible={false} />
            <Snippet solution={this.state.solution || undefined} />
          </HeaderFooterLayout>
          <Only when={this.state.isConsoleOpen}>
            <Console
              style={{ flex: '3', minHeight: '25rem' }}
              logs={this.state.logs}
              clearLogs={() => {}}
            />
          </Only>
        </AppWrapper>
        <Heartbeat onReceiveNewActiveSolution={this.onReceiveNewActiveSolution} />
      </Theme>
    );
  }
}

export default App;
