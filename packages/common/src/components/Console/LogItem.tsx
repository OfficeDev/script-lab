import React from 'react';
import CustomTailoredObjectInspector from './CustomTailoredObjectInspector';
import { LogEntry, LogText, ObjectInspectorLogEntry } from './styles';
import { stringifyPlusPlusOrErrorMessage } from '../../utilities/string';
import IconOrDiv from './IconOrDiv';

interface IProps {
  message: any;
  severity: ConsoleLogTypes;
  theme: ITheme;
}

export enum ConsoleLogSeverities {
  Info = 'info',
  Log = 'log',
  Warn = 'warn',
  Error = 'error',
}

const LogItem = ({ severity, message, theme }: IProps) => {
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

  return typeof message === 'object' ? (
    <ObjectInspectorLogEntry
      backgroundColor={backgroundColor}
      style={{ backgroundColor, color }}
    >
      <IconOrDiv icon={icon} />
      <CustomTailoredObjectInspector obj={message} />
    </ObjectInspectorLogEntry>
  ) : (
    <LogEntry style={{ backgroundColor, color }}>
      <IconOrDiv icon={icon} />
      <LogText>{stringifyPlusPlusOrErrorMessage(message)}</LogText>
    </LogEntry>
  );
};

export default LogItem;
