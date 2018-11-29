import React, { Component } from 'react';
import { editorUrls, getCurrentEnv } from '../../constants';

const LOCAL_STORAGE_POLLING_INTERVAL = 1000; // ms
const URL = editorUrls[getCurrentEnv()];
const HEARTBEAT_HTML_URL = `${URL}/heartbeat.html`;
const GET_ACTIVE_SOLUTION_REQUEST_MESSAGE = 'GET_ACTIVE_SOLUTION';

export interface IProps {
  host: string;
  onReceiveNewActiveSolution: (solution: ISolution | null) => void;
}

interface IState {
  activeSolution?: ISolution | null;
}

class Heartbeat extends Component<IProps, IState> {
  node;
  pollingInterval;
  state;

  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = { activeSolutionId: undefined };
  }

  componentDidMount() {
    this.pollingInterval = setInterval(() => {
      this.requestActiveSolution();
    }, LOCAL_STORAGE_POLLING_INTERVAL);

    window.onmessage = this.onWindowMessage;
  }

  componentWillUnmount() {
    clearInterval(this.pollingInterval);
    window.onmessage = null;
  }

  private requestActiveSolution = () => {
    if (this.node.current) {
      this.node.current.contentWindow!.postMessage(
        `${GET_ACTIVE_SOLUTION_REQUEST_MESSAGE}/${this.props.host}`,
        URL,
      );
    }
  };

  private onWindowMessage = ({ origin, data }) => {
    if (origin !== URL) {
      return;
    }

    try {
      const solution: ISolution | null = JSON.parse(data);
      if (
        (!this.state.activeSolution && solution) ||
        (this.state.activeSolution === undefined && solution === null) ||
        (solution &&
          (solution.id !== this.state.activeSolution.id ||
            solution.dateLastModified > this.state.activeSolution.dateLastModified))
      ) {
        this.setState({ activeSolution: solution });
        this.props.onReceiveNewActiveSolution(solution);
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
      <iframe style={{ display: 'none' }} src={HEARTBEAT_HTML_URL} ref={this.node} />
    );
  }
}

export default Heartbeat;
