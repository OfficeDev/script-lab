import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Utilities } from '@microsoft/office-js-helpers';

import Theme from 'common/lib/components/Theme';
import Console, { ConsoleLogSeverities } from 'common/lib/components/Console';
import HeaderFooterLayout from 'common/lib/components/HeaderFooterLayout';
import Heartbeat from './Heartbeat';
import Header from './Header';
import Footer from 'common/lib/components/Footer';
import Only from 'common/lib/components/Only';
import MessageBar from '../MessageBar';

import Snippet from '../Snippet';

const LAST_UPDATED_POLL_INTERVAL = 1000;

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
  lastUpdatedText: string;
  logs: ILogData[];
  isConsoleOpen: boolean;
}

export class App extends React.Component<{}, IState> {
  lastUpdatedTextPoll;

  constructor(props) {
    super(props);

    this.state = {
      solution: null,
      logs: [],
      isConsoleOpen: false,
      lastRendered: null,
      lastUpdatedText: '',
    };

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

    moment.relativeTimeThreshold('s', 40);
    // Note, per documentation, "ss" must be set after "s"
    moment.relativeTimeThreshold('ss', 1);
    moment.relativeTimeThreshold('m', 40);
    moment.relativeTimeThreshold('h', 20);
    moment.relativeTimeThreshold('d', 25);
    moment.relativeTimeThreshold('M', 10);
  }

  componentDidMount() {
    this.lastUpdatedTextPoll = setInterval(
      this.setLastUpdatedText,
      LAST_UPDATED_POLL_INTERVAL,
    );
    this.portConsole();
  }

  setLastUpdatedText = () =>
    this.setState({
      lastUpdatedText:
        this.state.lastRendered !== null
          ? `Last updated ${moment(new Date(this.state.lastRendered)).fromNow()}`
          : '',
    });

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

  softRefresh = () => {
    if (this.state.solution) {
      this.setState({
        solution: { ...this.state.solution, dateLastModified: Date.now() },
      });
    }
  };

  setLastRendered = (lastRendered: number) =>
    this.setState({ lastRendered }, this.setLastUpdatedText);

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
                hardRefresh={window.location.reload}
              />
            }
            footer={
              <Footer
                items={[
                  {
                    hidden: this.state.lastRendered === null,
                    key: 'last-updated',
                    text: this.state.lastUpdatedText,
                  },
                ]}
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
                    hidden: !this.state.isConsoleOpen,
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
            <Snippet
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
        <Heartbeat onReceiveNewActiveSolution={this.onReceiveNewActiveSolution} />
      </Theme>
    );
  }
}

export default App;
