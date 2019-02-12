import React from 'react';
import CustomTailoredObjectInspector from './CustomTailoredObjectInspector';
import { LogEntry, LogText, ObjectInspectorLogEntry } from './styles';
import { stringifyPlusPlusOrErrorMessage } from '../../utilities/string';
import IconOrDiv, { IIcon } from './IconOrDiv';

interface IProps {
  backgroundColor: string;
  color: string;
  icon?: IIcon;
  message: any;
}

const LogItem = ({ backgroundColor, color, icon, message }: IProps) =>
  typeof message === 'object' ? (
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

export default LogItem;
