import React from 'react';
import { TextField, ITextField } from 'office-ui-fabric-react/lib/TextField';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

import { Wrapper } from './styles';
import CopyableToClipboard from '../CopyableToClipboard';

interface IProps {
  text: string;
  style?: React.CSSProperties;
}

interface IState {
  isJustAfterCopy?: boolean;
}

const COLOR_ON_SUCCESS = '#78b597';
const DURATION_AFTER_SUCCESS_BEFORE_RESETTING_TO_REGULAR_COLOR = 750;

class TextboxClipboardWrapper extends React.Component<IProps, IState> {
  private timeout: any;
  /* Note: using "any" rather than "NodeJS.Timeout" or "number"
   * because TS was having issues when building it inside of the storybook context.
   */

  state: IState = {};

  render() {
    return (
      <Wrapper style={this.props.style}>
        <TextField
          readOnly={true}
          spellCheck={false}
          value={this.props.text}
          componentRef={this.onTextFieldReceivedRef}
        />
        <CopyableToClipboard textGetter={this.getTextToCopy} onSuccess={this.onSuccess}>
          <IconButton
            styles={
              this.state.isJustAfterCopy
                ? {
                    root: { background: COLOR_ON_SUCCESS },
                  }
                : {}
            }
            iconProps={{ iconName: 'Copy' }}
            ariaLabel="Copy to clipboard"
          />
        </CopyableToClipboard>
      </Wrapper>
    );
  }

  private onTextFieldReceivedRef = (ref: ITextField) => {
    // Do a best-effort to try to select the range
    // (Note, doesn't always work -- for example, doesn't work in IE,
    // and also doesn't seem to *always* select)
    if (ref) {
      ref.setSelectionRange(0, -1);
    }
  };

  private getTextToCopy = () => this.props.text;

  private onSuccess = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.setState({ isJustAfterCopy: true });
    this.timeout = setTimeout(
      () => this.setState({ isJustAfterCopy: false }),
      DURATION_AFTER_SUCCESS_BEFORE_RESETTING_TO_REGULAR_COLOR,
    );
  };
}

export default TextboxClipboardWrapper;
