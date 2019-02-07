import React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

import CopyableToClipboard from '../CopyableToClipboard';

interface IProps {
  textGetter: () => string;
  iconHeight?: string;
}

interface IState {
  isJustAfterCopy?: boolean;
}

const COLOR_ON_SUCCESS = '#78b597';
const DURATION_AFTER_SUCCESS_BEFORE_RESETTING_TO_REGULAR_COLOR = 750;

class CopyToClipboardIconButton extends React.Component<IProps, IState> {
  state: IState = {};
  private timeout: any;
  /* Note: using "any" rather than "NodeJS.Timeout" or "number"
   * because TS was having issues when building it inside of the storybook context.
   */

  render() {
    return (
      <CopyableToClipboard textGetter={this.props.textGetter} onSuccess={this.onSuccess}>
        <IconButton
          styles={
            this.state.isJustAfterCopy
              ? {
                  root: { background: COLOR_ON_SUCCESS },
                }
              : {}
          }
          style={this.props.iconHeight ? { height: this.props.iconHeight } : {}}
          iconProps={{ iconName: 'Copy' }}
          title="Copy to clipboard"
        />
      </CopyableToClipboard>
    );
  }

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

export default CopyToClipboardIconButton;
