import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { number } from '@storybook/addon-knobs';
import Console, { IProps } from './index';
import { getLogPages } from './Console.stories.sampledata'; // cspell:ignore sampledata

const props: IProps = {
  logs: getLogPages(1),
  clearLogs: action('clearLogs'),
};

const SimpleWrapper = ({ children }) => (
  <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>{children}</div>
);

class ConsoleWrapper extends React.Component<{ interval: number }> {
  loggingInterval: any;
  counter = 0;
  state: { logs: ILogData[] } = { logs: [] };

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
    (this.loggingInterval = setInterval(() => {
      const { message, severity } = getRandomLogEntry();
      this.setState({
        logs: [
          ...this.state.logs,
          {
            message,
            severity,
            id: (this.counter++).toString(),
          },
        ],
      });
    }, this.props.interval));

  clearLogs = () => this.setState({ logs: [] });

  render() {
    return <Console clearLogs={this.clearLogs} logs={this.state.logs} />;
  }
}

storiesOf('Console', module)
  .add('basic', () => (
    <SimpleWrapper>
      <Console {...props} />
    </SimpleWrapper>
  ))
  .add('with a LOT of logs', () => (
    <SimpleWrapper>
      <Console {...props} logs={getLogPages(50)} />
    </SimpleWrapper>
  ))
  .add('with logs being added', () => (
    <SimpleWrapper>
      <ConsoleWrapper interval={number('interval for adding logs', 1000)} />
    </SimpleWrapper>
  ));

///////////////////////////////////////

function getRandomLogEntry() {
  return props.logs[Math.floor(Math.random() * props.logs.length)];
}
