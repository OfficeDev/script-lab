import React from 'react';
import styled from 'styled-components';
import { Utilities } from '@microsoft/office-js-helpers';
import queryString from 'query-string';
import { stringifyPlusPlus } from 'common/lib/utilities/string';

import Theme from 'common/lib/components/Theme';
import Console, { ConsoleLogSeverities } from 'common/lib/components/Console';
import HeaderFooterLayout from 'common/lib/components/HeaderFooterLayout';
import { SCRIPT_URLS } from 'common/lib/constants';
import { extractParams } from 'common/lib/utilities/script.loader';

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

interface IState {
  solution?: ISolution | null;
  lastRendered: number | null;
  logs: ILogData[];
  isConsoleOpen: boolean;
  officeJsUrl: string;
}

export class App extends React.Component<{}, IState> {
  constructor(props) {
    super(props);

    const params = extractParams(window.location.href.split('?')[1]) || {};
    const officeJsUrl =
      ((params['officejs'] as string) || '').trim().length > 0
        ? params['officejs'] || ''
        : SCRIPT_URLS.OFFICE_JS_FOR_EDITOR;

    this.state = {
      solution: undefined,
      logs: [],
      isConsoleOpen: false,
      lastRendered: null,
      officeJsUrl,
    };
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

  onReceiveNewActiveSolution = (solution: ISolution | null) => {
    if (solution !== null && this.state.solution) {
      console.info(`Your snippet '${solution.name}' has been loaded.`);
    }
    this.setState({ solution });
  };

  softRefresh = () => {
    if (this.state.solution) {
      this.setState({
        solution: { ...this.state.solution, dateLastModified: Date.now() },
      });
    }
  };

  // FIXME Zlatkovsky
  reloadPage = () => window.location.reload();

  onSnippetRender = (lastRendered: number) => {
    this.setState({ lastRendered });

    const loadingIndicator = document.getElementById('loading')!;
    loadingIndicator.style.visibility = 'hidden';
  };

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
              officeJsUrl={this.state.officeJsUrl}
              solution={this.state.solution}
              onRender={this.onSnippetRender}
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
