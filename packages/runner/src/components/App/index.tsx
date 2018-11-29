import React from 'react';
import styled from 'styled-components';
import { Utilities } from '@microsoft/office-js-helpers';
import { stringifyPlusPlus } from 'common/lib/utilities/string';

import Theme from 'common/lib/components/Theme';
import Console, { ConsoleLogSeverities } from 'common/lib/components/Console';
import HeaderFooterLayout from 'common/lib/components/HeaderFooterLayout';
import Heartbeat from './Heartbeat';
import Header from './Header';
import Footer from './Footer';
import Only from 'common/lib/components/Only';
import MessageBar from '../MessageBar';

import SnippetContainer from '../SnippetContainer';

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
  lastRendered: number | null;
  logs: ILogData[];
  isConsoleOpen: boolean;
}

export class App extends React.Component<{}, IState> {
  constructor(props) {
    super(props);

    this.state = {
      solution: null,
      logs: [],
      isConsoleOpen: false,
      lastRendered: null,
    };

    Office.onReady(() => {
      const loadingIndicator = document.getElementById('loading');
      if (loadingIndicator) {
        const { parentNode } = loadingIndicator;
        if (parentNode) {
          parentNode.removeChild(loadingIndicator);
        }
      }
      this.forceUpdate();
    });
  }

  componentDidMount() {
    this.monkeypatchConsole();
  }

  monkeypatchConsole = () => {
    ['info', 'warn', 'error', 'log'].forEach(method => {
      const oldMethod = window.console[method];
      window.console[method] = (...args: any[]) => {
        oldMethod(...args);
        try {
          const message = stringifyPlusPlus(args);

          setTimeout(
            () =>
              this.addLog({
                severity: method as ConsoleLogTypes,
                message,
              }),
            0,
          );
        } catch (error) {
          // This shouldn't happen (stringifyPlusPlus should ensure there are no circular structures)
          // But just in case...
          setTimeout(
            () =>
              this.addLog({
                severity: ConsoleLogSeverities.Error,
                message: '[Could not display log entry]',
              }),
            0,
          );
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

  softRefresh = () => {
    if (this.state.solution) {
      this.setState({
        solution: { ...this.state.solution, dateLastModified: Date.now() },
      });
      console.info(`Your snippet '${this.state.solution.name}' has been reloaded.`);
    }
  };

  reloadPage = () => window.location.reload();

  setLastRendered = (lastRendered: number) => this.setState({ lastRendered });

  render() {
    return (
      <Theme host={this.state.solution ? this.state.solution.host : Utilities.host}>
        <AppWrapper>
          <HeaderFooterLayout
            wrapperStyle={{ flex: '7' }}
            header={
              <Header
                solutionName={this.state.solution ? this.state.solution.name : undefined}
                refresh={this.softRefresh}
                hardRefresh={this.reloadPage}
              />
            }
            footer={
              <Footer
                isConsoleOpen={this.state.isConsoleOpen}
                openConsole={this.openConsole}
                closeConsole={this.closeConsole}
                isSolutionLoaded={this.state.solution !== null}
                lastRendered={this.state.lastRendered}
                refresh={this.softRefresh}
              />
            }
          >
            <RefreshBar isVisible={false} />
            <SnippetContainer
              solution={this.state.solution || undefined}
              onRender={this.setLastRendered}
            />
          </HeaderFooterLayout>
          <Only when={this.state.isConsoleOpen}>
            <Console
              style={{ flex: '3', minHeight: '25rem' }}
              logs={this.state.logs}
              clearLogs={this.clearLogs}
            />
          </Only>
        </AppWrapper>
        <Heartbeat
          host={Utilities.host}
          onReceiveNewActiveSolution={this.onReceiveNewActiveSolution}
        />
      </Theme>
    );
  }
}

export default App;
