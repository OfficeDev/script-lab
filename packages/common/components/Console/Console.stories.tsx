import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Console, { IProps, ConsoleLogSeverities } from './index';

const logs = [
  {
    message: 'This is a test of an INFO message.',
    severity: ConsoleLogSeverities.Info,
  },
  {
    message: 'This is a test of a LOG message.',
    severity: ConsoleLogSeverities.Log,
  },
  {
    message: 'This is a test of a WARNING message.',
    severity: ConsoleLogSeverities.Warn,
  },
  {
    message: 'This is a test of an ERROR message.',
    severity: ConsoleLogSeverities.Error,
  },
  {
    message:
      "This is a test of an ERROR message. Also, this error message happens to be very very long. Super long. It's only purpose is to be super long. So long that we can test that the log container properly resizes itself and shows all of this super important, meaningful text that will help us understand if this log will be readable by the user.",
    severity: ConsoleLogSeverities.Error,
  },
].map(log => ({ ...log, source: 'someSampleSource' }));

const props: IProps = {
  logs,
  clearLogs: action('clearLogs'),
};

storiesOf('Console', module).add('basic', () => <Console {...props} />);
