import React, { Component } from 'react';
import { currentEditorUrl } from 'common/lib/environment';
import {
  RUNNER_TO_EDITOR_HEARTBEAT_REQUESTS,
  EDITOR_HEARTBEAT_TO_RUNNER_RESPONSES,
  IEditorHeartbeatToRunnerResponse,
} from 'common/lib/constants';
import { ScriptLabError } from 'common/lib/utilities/error';

const LOCAL_STORAGE_POLLING_INTERVAL = 300; // ms
const heartbeatEditorUrl = `${currentEditorUrl}/#/heartbeat`;

export interface IProps {
  host: string;
  onReceiveNewActiveSolution: (solution: ISolution | null) => void;
  onReceivedMessageToPassToUserSnippet: (
    message: IEditorHeartbeatToRunnerResponse,
  ) => void;
}

interface IState {
  activeSolution?: ISolution | null;
}

class Heartbeat extends Component<IProps, IState> {
  node = React.createRef<HTMLIFrameElement>();
  state: IState = { activeSolution: undefined };
  pollingInterval: any;

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

  sendMessage = (message: string) => {
    if (this.node.current) {
      this.node.current.contentWindow.postMessage(message, currentEditorUrl);
    }
  };

  private requestActiveSolution = () => {
    this.sendMessage(
      `${RUNNER_TO_EDITOR_HEARTBEAT_REQUESTS.GET_ACTIVE_SOLUTION}/${this.props.host}`,
    );
  };

  private onWindowMessage = ({ origin, data }) => {
    if (origin !== currentEditorUrl) {
      return;
    }

    const processActiveSolution = (solutionText: string) => {
      const solution = JSON.parse(solutionText) as ISolution | null;
      if (solution && solution.options.isCustomFunctionsSolution) {
        window.location.href = `${currentEditorUrl}/custom-functions.html`;
      }

      if (this.checkIfSolutionChanged(solution)) {
        this.setState({ activeSolution: solution });
        this.props.onReceiveNewActiveSolution(solution);
      }
    };

    try {
      const parsedData = data as IEditorHeartbeatToRunnerResponse;

      const responsesMap: { [key: string]: () => void } = {
        undefined: () => {
          // Old behavior, when the only message was assumed to be the active solution,
          //   and there was no concept of "type"
          processActiveSolution(parsedData as any);
        },
        [EDITOR_HEARTBEAT_TO_RUNNER_RESPONSES.ACTIVE_SOLUTION]: () => {
          processActiveSolution(parsedData.contents);
        },
        [EDITOR_HEARTBEAT_TO_RUNNER_RESPONSES.PASS_MESSAGE_TO_USER_SNIPPET]: () => {
          this.props.onReceivedMessageToPassToUserSnippet(parsedData.contents);
        },
      };

      const appropriateResponse = responsesMap[parsedData.type];
      if (appropriateResponse) {
        appropriateResponse();
      } else {
        throw new ScriptLabError('Invalid heartbeat message received', data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
      <iframe
        style={{ display: 'none' }}
        title="heartbeat"
        src={heartbeatEditorUrl}
        ref={this.node}
      />
    );
  }

  // helpers

  private checkIfSolutionChanged(solution: ISolution | null) {
    // If I didn't have a solution before, but do now, things changed
    if ((!this.state.activeSolution && solution) || solution === null) {
      return true;
    }

    // Note: by this point, this.state.activeSolution is going to be defined,
    // or else it would have been caught by the preceding if statements.

    if (solution) {
      // if the solution's id is different than the current solution ID, it's a new solution!
      if (solution.id !== this.state.activeSolution.id) {
        return true;
      }

      if (solution.dateLastModified > this.state.activeSolution.dateLastModified) {
        return true;
      }
    }

    // Otherwise
    return false;
  }
}

export default Heartbeat;
