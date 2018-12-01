import React from 'react';
import styled from 'styled-components';
import { Utilities } from '@microsoft/office-js-helpers';
import queryString from 'query-string';
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
import { currentEditorUrl } from '../../constants';

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

let logCount = 0;

interface IState {
  solution?: ISolution | null;
  lastRendered: number | null;
  logs: ILogData[];
  isConsoleOpen: boolean;
}

export class App extends React.Component<{}, IState> {
  constructor(props) {
    super(props);

    this.state = {
      solution: undefined,
      logs: [],
      isConsoleOpen: false,
      lastRendered: null,
    };

    const loadingIndicator = document.getElementById('loading')!;
    loadingIndicator.style.visibility = 'hidden';
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

  addLog = (log: { severity: ConsoleLogTypes; message: string }) => {
    this.setState({
      logs: [...this.state.logs, { id: logCount.toString(), ...log }],
      isConsoleOpen: true,
    });
    logCount++;
  };
  clearLogs = () => this.setState({ logs: [] });

  openConsole = () => this.setState({ isConsoleOpen: true });
  closeConsole = () => this.setState({ isConsoleOpen: false });

  onReceiveNewActiveSolution = (solution: ISolution | null) => {
    if (solution !== null) {
      if (!this.state.solution) {
        console.info(`Your snippet "${solution.name}" has been loaded.`);
      } else if (this.state.solution.id === solution.id) {
        console.info(`Updating your snippet "${solution.name}".`);
      } else {
        console.info(`Switching to snippet "${solution.name}".`);
      }
    }
    this.setState({ solution });
  };

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
                solution={this.state.solution}
                refresh={this.softRefresh}
                hardRefresh={this.reloadPage}
                goBack={
                  !!queryString.parse(location.search).backButton
                    ? () => (location.href = currentEditorUrl)
                    : undefined
                }
              />
            }
            footer={
              <Footer
                isConsoleOpen={this.state.isConsoleOpen}
                openConsole={this.openConsole}
                closeConsole={this.closeConsole}
                isSolutionLoaded={!!this.state.solution}
                lastRendered={this.state.lastRendered}
                refresh={this.softRefresh}
              />
            }
          >
            <RefreshBar isVisible={false} />
            <SnippetContainer
              solution={this.state.solution}
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
