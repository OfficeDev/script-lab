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

interface IState {
  filterQuery: string;
}

class Console extends React.Component<IProps, IState> {
  private logFetchInterval: any;
  state: IState = { filterQuery: '' };

  componentDidMount() {
    this.logFetchInterval = setInterval(this.props.fetchLogs, 500);
  }

  componentWillUnmount() {
    clearInterval(this.logFetchInterval);
  }

  updateFilterQuery = () =>
    this.setState({
      filterQuery: (this.refs.filterTextInput as any).value.toLowerCase(),
    });

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
