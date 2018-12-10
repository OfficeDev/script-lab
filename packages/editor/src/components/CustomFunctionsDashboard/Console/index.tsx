import React from 'react';
import { withTheme } from 'styled-components';
import moment from 'moment';
import CommonConsole from 'common/lib/components/Console';

import { Wrapper, NoLogsPlaceholderContainer, NoLogsPlaceholder } from './styles';

import { setUpMomentJsDurationDefaults } from '../../../utils';
import { connect } from 'react-redux';
import { IState as IReduxState } from '../../../store/reducer';
import actions, { IRootAction } from '../../../store/actions';
import { Dispatch } from 'redux';

export enum ConsoleLogTypes {
  Info = 'info',
  Log = 'log',
  Warn = 'warn',
  Error = 'error',
}

interface IPropsFromRedux {
  logs: ILogData[];
}

const mapStateToProps = (state: IReduxState): IPropsFromRedux => ({
  logs: state.customFunctions.logs,
});

interface IActionsFromRedux {
  fetchLogs: () => void;
  clearLogs: () => void;
}

const mapDispatchToProps = (dispatch: Dispatch<IRootAction>): IActionsFromRedux => ({
  fetchLogs: () => dispatch(actions.customFunctions.fetchLogs()),
  clearLogs: () => dispatch(actions.customFunctions.clearLogs()),
});

interface IConsole extends IPropsFromRedux, IActionsFromRedux {
  theme: ITheme; // from withTheme
}

interface IState {
  filterQuery: string;
}

class ConsoleWithoutTheme extends React.Component<IConsole, IState> {
  private logFetchInterval: any;
  state = { filterQuery: '' };

  constructor(props: IConsole) {
    super(props);

    setUpMomentJsDurationDefaults(moment);
  }

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
    const { theme, logs, clearLogs } = this.props;

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

export const Console = withTheme(ConsoleWithoutTheme);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Console);
