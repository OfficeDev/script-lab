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
        // oldMethod(...args);
        // console.log(args);
        setTimeout(
          () =>
            this.addLog({
              severity: method as ConsoleLogTypes,
              message: args[0],
              source: 'idk',
            }),
          0,
        );
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
      <>
        <Theme host={this.state.solution ? this.state.solution.host : Utilities.host}>
          {(theme: ITheme) => (
            <HeaderFooterLayout
              header={
                <Header
                  solutionName={
                    this.state.solution ? this.state.solution.name : undefined
                  }
                  goBack={() => {}}
                  refresh={() => window.location.reload()}
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
                      iconProps: { iconName: 'CaretSolidUp' },
                      onClick: this.openConsole,
                    },
                    {
                      hidden: !this.state.isConsoleOpen || this.state.solution === null,
                      key: 'close-console',
                      text: 'Close Console',
                      iconProps: { iconName: 'CaretSolidDown' },
                      onClick: this.closeConsole,
                    },
                  ]}
                />
              }
            >
              <RefreshBar isVisible={false} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '1',
                  height: '100%',
                }}
              >
                {this.state.solution && (
                  <div style={{ flex: '7', minHeight: '7rem' }}>
                    <Snippet solution={this.state.solution!} />
                  </div>
                )}

                <Only when={this.state.isConsoleOpen}>
                  <div style={{ height: '2px', background: theme.primary }} />
                  <Console
                    style={{
                      flex: '3',
                      minHeight: '25rem',
                    }}
                    logs={this.state.logs}
                    clearLogs={() => {}}
                  />
                </Only>
              </div>
            </HeaderFooterLayout>
          )}
        </Theme>
        <Heartbeat onReceiveNewActiveSolution={this.onReceiveNewActiveSolution} />
      </>
    );
  }
}

export default App;
