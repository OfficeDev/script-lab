import React from 'react';
import { withTheme } from 'styled-components';

import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

import CustomTailoredObjectInspector from './custom.tailored.object.inspector';

import {
  Wrapper,
  CheckboxWrapper,
  LogsArea,
  LogEntry,
  ObjectInspectorLogEntry,
  LogText,
  HeaderWrapper,
  NoLogsPlaceholder,
  NoLogsPlaceholderContainer,
} from './styles';
import HeaderFooterLayout from '../HeaderFooterLayout';

import CopyToClipboardIconButton from '../Clipboard/CopyToClipboardIconButton';
import Only from '../Only';
import { stringifyPlusPlusOrErrorMessage } from '../../utilities/string';

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
}

class Console extends React.Component<IPrivateProps, IState> {
  private lastLog = React.createRef<HTMLDivElement>();
  state: IState = { shouldScrollToBottom: true };
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

        return prefix + stringifyPlusPlusOrErrorMessage(item.message);
      })
      .join('\n\n');

  scrollToBottom() {
    if (this.state.shouldScrollToBottom && this.lastLog.current) {
      this.lastLog.current.scrollIntoView();
    }
  }

  render() {
    const { theme, logs, clearLogs, style } = this.props;

    const items = logs
      .slice(-1 * MAX_LOGS_SHOWN) // get the last X logs
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
            <Only when={logs.length > 0}>
              <HeaderWrapper>
                <CheckboxWrapper>
                  <Checkbox
                    label="Auto-scroll"
                    defaultChecked={true}
                    onChange={this.setShouldScrollToBottom}
                  />
                </CheckboxWrapper>

                <IconButton
                  iconProps={{ iconName: 'Clear' }}
                  style={{ height: '3.2rem' }}
                  styles={{ iconHovered: { color: '#b22222' } }}
                  title="Clear"
                  onClick={clearLogs}
                />

                <CopyToClipboardIconButton textGetter={this.getTextToCopy} />
              </HeaderWrapper>
            </Only>
          }
          footer={null}
        >
          {items.length === 0 ? (
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
                to display logs here.
              </NoLogsPlaceholder>
            </NoLogsPlaceholderContainer>
          ) : (
            <LogsArea>
              {items.map(({ backgroundColor, color, key, icon, message }) =>
                typeof message === 'object' ? (
                  <ObjectInspectorLogEntry
                    key={key}
                    backgroundColor={backgroundColor}
                    style={{ backgroundColor, color }}
                  >
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
                    <CustomTailoredObjectInspector obj={message} />
                  </ObjectInspectorLogEntry>
                ) : (
                  <LogEntry key={key} style={{ backgroundColor, color }}>
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
                    <LogText>{stringifyPlusPlusOrErrorMessage(message)}</LogText>
                  </LogEntry>
                ),
              )}

              <div ref={this.lastLog} />
            </LogsArea>
          )}
        </HeaderFooterLayout>
      </Wrapper>
    );
  }
}

export default withTheme(Console);
