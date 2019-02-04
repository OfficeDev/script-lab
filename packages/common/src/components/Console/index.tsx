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
  Log,
  LogText,
  FooterWrapper,
} from './styles';
import HeaderFooterLayout from '../HeaderFooterLayout';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

import Only from '../Only';
import CopyableToClipboard from '../CopyableToClipboard';

const MAX_LOGS_SHOWN = 100;

export enum ConsoleLogSeverities {
  Info = 'info',
  Log = 'log',
  Warn = 'warn',
  Error = 'error',
}

export interface IProps {
  logs: ILogData[];
  clearLogs: () => void;
  style?: object;
}

interface IPrivateProps extends IProps {
  theme: ITheme;
}

interface IState {
  shouldScrollToBottom: boolean;
  filterQuery: string;
}

class Console extends React.Component<IPrivateProps, IState> {
  private lastLog = React.createRef<HTMLDivElement>();
  state: IState = { shouldScrollToBottom: true, filterQuery: '' };
  inputRef = React.createRef<HTMLInputElement>();

  static defaultProps = {
    style: {},
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  setShouldScrollToBottom = (ev: React.FormEvent<HTMLElement>, checked: boolean) =>
    this.setState({ shouldScrollToBottom: checked });

  getTextToCopy = () =>
    this.props.logs
      .map(item => {
        let prefix = '';
        if (item.severity === 'warn') {
          prefix = '[WARNING]: ';
        } else if (item.severity === 'error') {
          prefix = '[ERROR]: ';
        }

        return prefix + item.message;
      })
      .join('\n\n');

  updateFilterQuery = () =>
    this.setState({
      filterQuery: this.inputRef.current.value.toLowerCase(),
    });

  scrollToBottom() {
    if (this.state.shouldScrollToBottom && this.lastLog.current) {
      this.lastLog.current.scrollIntoView();
    }
  }

  render() {
    const { theme, logs, clearLogs, style } = this.props;

    const items = logs
      .slice(-1 * MAX_LOGS_SHOWN) // get the last X logs
      .filter(log => log.message.toLowerCase().includes(this.state.filterQuery))
      .map(({ id, severity, message }) => {
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
        }[severity];

        return {
          key: `${severity}-${id}}`,
          backgroundColor,
          color,
          icon,
          message,
        };
      });

    return (
      <Wrapper style={{ backgroundColor: theme.neutralLighter, ...style }}>
        <HeaderFooterLayout
          header={
            <FilterWrapper>
              <ClearButton onClick={clearLogs}>
                <Icon
                  style={{ width: '2rem', height: '2rem', lineHeight: '2rem' }}
                  iconName="EraseTool"
                />
              </ClearButton>
              <input
                className="ms-font-m"
                type="text"
                placeholder="Filter"
                onChange={this.updateFilterQuery}
                ref={this.inputRef}
                style={{
                  width: '100%',
                  height: '3.2rem',
                  padding: '0.6rem',
                  boxSizing: 'border-box',
                }}
              />
            </FilterWrapper>
          }
          footer={
            <FooterWrapper>
              <CheckboxWrapper>
                <Checkbox
                  label="Auto-scroll"
                  defaultChecked={true}
                  onChange={this.setShouldScrollToBottom}
                />
              </CheckboxWrapper>
              <Only when={logs.length > 0}>
                <CopyableToClipboard textGetter={this.getTextToCopy}>
                  <IconButton
                    iconProps={{ iconName: 'Copy' }}
                    style={{ height: '3.8rem' }}
                    ariaLabel="Copy to clipboard"
                  />
                </CopyableToClipboard>
              </Only>
            </FooterWrapper>
          }
        >
          <LogsArea>
            {items.map(({ backgroundColor, color, key, icon, message }) => (
              <Log key={key} style={{ backgroundColor, color }}>
                {icon ? (
                  <Icon
                    className="ms-font-m"
                    iconName={icon.name}
                    style={{
                      fontSize: '1.2rem',
                      color: icon.color,
                      lineHeight: '1.2rem',
                    }}
                  />
                ) : (
                  <div style={{ width: '1.2rem', height: '1.2rem' }} />
                )}
                <LogText>{message}</LogText>
              </Log>
            ))}
            <div ref={this.lastLog} />
          </LogsArea>
        </HeaderFooterLayout>
      </Wrapper>
    );
  }
}

export default withTheme(Console);
