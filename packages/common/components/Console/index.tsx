import React from 'react';
import { withTheme } from 'styled-components';

import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

import {
  Wrapper,
  CheckboxWrapper,
  ClearButton,
  FilterWrapper,
  LogsArea,
  LogsList,
  Log,
} from './styles';

export enum ConsoleLogSeverities {
  Info = 'info',
  Log = 'log',
  Warn = 'warn',
  Error = 'error',
}

export interface IProps {
  logs: ILogData[];
  clearLogs: () => void;
}

interface IPrivateProps extends IProps {
  theme: ITheme;
}

interface IState {
  shouldScrollToBottom: boolean;
  filterQuery: string;
}

class Console extends React.Component<IPrivateProps, IState> {
  constructor(props: IPrivateProps) {
    super(props);
    this.state = { shouldScrollToBottom: true, filterQuery: '' };
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  setShouldScrollToBottom = (ev: React.FormEvent<HTMLElement>, checked: boolean) =>
    this.setState({ shouldScrollToBottom: checked });

  updateFilterQuery = () =>
    this.setState({
      filterQuery: (this.refs.filterTextInput as any).value.toLowerCase(),
    });

  scrollToBottom() {
    if (this.state.shouldScrollToBottom && this.refs.lastLog) {
      (this.refs.lastLog as any).scrollIntoView();
    }
  }

  render() {
    const { theme, logs, clearLogs } = this.props;

    return (
      <Wrapper>
        <FilterWrapper>
          <ClearButton onClick={clearLogs}>
            <Icon
              style={{
                position: 'absolute',
                top: '0px',
                bottom: '0px',
                left: '0px',
                right: '0px',
                width: '2rem',
                height: '2rem',
                lineHeight: '2rem',
              }}
              iconName="Clear"
            />
          </ClearButton>
          <input
            className="ms-font-m"
            type="text"
            placeholder="Filter"
            onChange={this.updateFilterQuery}
            ref="filterTextInput"
            style={{
              width: '100%',
              height: '3.2rem',
              padding: '0.6rem',
              boxSizing: 'border-box',
            }}
          />
        </FilterWrapper>
        <LogsArea>
          <LogsList>
            {logs
              .filter(log => log.message.toLowerCase().includes(this.state.filterQuery))
              .map((log, i) => {
                const { backgroundColor, color, icon } = {
                  [ConsoleLogSeverities.Log]: {
                    backgroundColor: theme.white,
                    color: theme.black,
                    icon: null,
                  },
                  [ConsoleLogSeverities.Info]: {
                    backgroundColor: '#cce6ff',
                    color: theme.black,
                    icon: { name: 'Info', color: '#002db3' },
                  },
                  [ConsoleLogSeverities.Warn]: {
                    backgroundColor: '#fff4ce',
                    color: theme.black,
                    icon: { name: 'Warning', color: 'gold' },
                  },
                  [ConsoleLogSeverities.Error]: {
                    backgroundColor: '#fde7e9',
                    color: theme.black,
                    icon: { name: 'Error', color: 'red' },
                  },
                }[log.severity];
                return (
                  <Log key={`${log.severity}-${i}`} style={{ backgroundColor, color }}>
                    {icon && (
                      <Icon
                        className="ms-font-m"
                        iconName={icon.name}
                        style={{
                          fontSize: '1.6rem',
                          color: icon.color,
                          marginRight: '0.5rem',
                        }}
                      />
                    )}
                    {log.message}
                  </Log>
                );
              })}
          </LogsList>
          <div ref="lastLog" />
        </LogsArea>
        <CheckboxWrapper>
          <Checkbox
            label="Auto-scroll"
            defaultChecked={true}
            onChange={this.setShouldScrollToBottom}
          />
        </CheckboxWrapper>
      </Wrapper>
    );
  }
}

export default withTheme(Console);
