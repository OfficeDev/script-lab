import React from 'react';
import { storiesOf } from '@storybook/react';

import { IState as IMessageBarState } from '../../../store/messageBar/reducer';
import { MessageBar } from './';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

const defaultMessageBarProps: IMessageBarState = {
  isVisible: true,
  style: MessageBarType.info,
  text: 'Hello. I am a sample message.',
  link: null,
};

const voidFunc = () => {};

storiesOf('IDE|MessageBar', module)
  .add('basic info', () => (
    <MessageBar messageBarProps={defaultMessageBarProps} dismiss={voidFunc} />
  ))
  .add('basic success', () => (
    <MessageBar
      messageBarProps={{
        ...defaultMessageBarProps,
        text: 'Success! It worked!',
        style: MessageBarType.success,
      }}
      dismiss={voidFunc}
    />
  ))
  .add('basic warning', () => (
    <MessageBar
      messageBarProps={{
        ...defaultMessageBarProps,
        text: 'You have been warned.',
        style: MessageBarType.warning,
      }}
      dismiss={voidFunc}
    />
  ))
  .add('basic error', () => (
    <MessageBar
      messageBarProps={{
        ...defaultMessageBarProps,
        text: 'Error! Failure!',
        style: MessageBarType.error,
      }}
      dismiss={voidFunc}
    />
  ));
