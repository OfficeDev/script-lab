import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { number } from '@storybook/addon-knobs';
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
];

const lotsOfLogs = [
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
];

const props: IProps = {
  logs,
  clearLogs: action('clearLogs'),
};

const SimpleWrapper = ({ children }) => (
  <div style={{ display: 'flex', height: '100vh' }}>{children}</div>
);

class ConsoleWrapper extends React.Component<{ interval: number }> {
  loggingInterval;
  state = { logs: [] };

  componentDidMount() {
    this.setInterval();
  }

  componentWillUnmount() {
    clearInterval(this.loggingInterval);
  }

  componentDidUpdate() {
    clearInterval(this.loggingInterval);
    this.setInterval();
  }

  setInterval = () =>
    (this.loggingInterval = setInterval(
      () =>
        this.setState({
          logs: [
            ...this.state.logs,
            { severity: 'log', message: `I am log #${this.state.logs.length}` },
          ],
        }),
      this.props.interval,
    ));

  clearLogs = () => this.setState({ logs: [] });

  render() {
    return <Console clearLogs={this.clearLogs} logs={this.state.logs} />;
  }
}

storiesOf('Console', module)
  .add('basic', () => <Console {...props} />)
  .add('with a LOT of logs', () => <Console {...props} logs={lotsOfLogs} />)
  .add('with logs being added', () => (
    <SimpleWrapper>
      <ConsoleWrapper interval={number('interval for adding logs', 1000)} />
    </SimpleWrapper>
  ));
