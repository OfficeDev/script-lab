import React from 'react';
import CommonConsole from 'common/lib/components/Console';

import { Wrapper, NoLogsPlaceholderContainer, NoLogsPlaceholder } from './styles';

export enum ConsoleLogTypes {
  Info = 'info',
  Log = 'log',
  Warn = 'warn',
  Error = 'error',
}

interface IProps {
  logs: ILogData[];
  fetchLogs();
  clearLogs();
}

class Console extends React.Component<IProps> {
  private logFetchInterval: any;

  componentDidMount() {
    this.logFetchInterval = setInterval(this.props.fetchLogs, 250);
  }

  componentWillUnmount() {
    clearInterval(this.logFetchInterval);
  }

  render() {
    const { logs, clearLogs } = this.props;

    return (
      <Wrapper>
        {logs.length > 0 ? (
          <CommonConsole logs={logs} clearLogs={clearLogs} />
        ) : (
          <NoLogsPlaceholderContainer>
            <NoLogsPlaceholder>
              There are no logs to display. Use{' '}
              <pre
                style={{
                  fontFamily: 'Consolas, monaco, monospace',
                  fontWeight: 'bold',
                  display: 'inline',
                }}
              >
                console.log()
              </pre>{' '}
              inside your functions to display logs here.
            </NoLogsPlaceholder>
          </NoLogsPlaceholderContainer>
        )}
      </Wrapper>
    );
  }
}

export default Console;
