import React from 'react';
import CommonFooter from 'common/lib/components/Footer';

import moment from 'moment';

const LAST_UPDATED_POLL_INTERVAL = 1000;

export interface IProps {
  isConsoleOpen: boolean;
  openConsole: () => void;
  closeConsole: () => void;

  isSolutionLoaded: boolean;

  lastRendered: number | null;
}

interface IState {
  lastUpdatedText: string;
}

class Footer extends React.Component<IProps, IState> {
  lastUpdatedTextPoll;

  constructor(props: IProps) {
    super(props);
    this.state = { lastUpdatedText: '' };

    moment.relativeTimeThreshold('s', 40);
    // Note, per documentation, "ss" must be set after "s"
    moment.relativeTimeThreshold('ss', 1);
    moment.relativeTimeThreshold('m', 40);
    moment.relativeTimeThreshold('h', 20);
    moment.relativeTimeThreshold('d', 25);
    moment.relativeTimeThreshold('M', 10);
  }

  componentDidMount() {
    this.lastUpdatedTextPoll = setInterval(
      this.setLastUpdatedText,
      LAST_UPDATED_POLL_INTERVAL,
    );
  }

  componentWillUnmount() {
    clearInterval(this.lastUpdatedTextPoll);
  }

  setLastUpdatedText = () =>
    this.setState({
      lastUpdatedText:
        this.props.lastRendered !== null
          ? `Last updated ${moment(new Date(this.props.lastRendered)).fromNow()}`
          : '',
    });

  render() {
    return (
      <CommonFooter
        items={[
          {
            hidden: this.state.lastUpdatedText === '',
            key: 'last-updated',
            text: this.state.lastUpdatedText,
          },
        ]}
        farItems={[
          {
            hidden: this.props.isConsoleOpen || this.props.isSolutionLoaded,
            key: 'open-console',
            text: 'Open Console',
            iconProps: {
              iconName: 'CaretSolidUp',
              styles: { root: { fontSize: '1.2rem' } },
            },
            onClick: this.props.openConsole,
          },
          {
            hidden: !this.props.isConsoleOpen,
            key: 'close-console',
            text: 'Close Console',
            iconProps: {
              iconName: 'CaretSolidDown',
              styles: { root: { fontSize: '1.2rem' } },
            },
            onClick: this.props.closeConsole,
          },
        ]}
      />
    );
  }
}

export default Footer;
