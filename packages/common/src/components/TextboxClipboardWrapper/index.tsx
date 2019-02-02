import React from 'react';
import Clipboard from 'clipboard';
import { TextField, ITextField } from 'office-ui-fabric-react/lib/TextField';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { invokeGlobalErrorHandler } from '../../utilities/splash.screen';
import { generateCryptoSafeRandom } from '../../utilities/misc';

import { Wrapper } from './styles';

interface IProps {
  text: string;
  style?: React.CSSProperties;
}

interface IState {}

class TextboxClipboardWrapper extends React.Component<IProps, IState> {
  private clipboardButtonClassName: string;
  private clipboard: Clipboard;

  constructor(props: IProps) {
    super(props);

    this.clipboardButtonClassName = 'export-to-clipboard-' + generateCryptoSafeRandom();
    this.clipboard = new Clipboard('.' + this.clipboardButtonClassName, {
      text: () => this.props.text,
    });
    this.clipboard.on('error', invokeGlobalErrorHandler);
  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  render() {
    return (
      <Wrapper style={this.props.style}>
        <TextField
          readOnly={true}
          spellCheck={false}
          value={this.props.text}
          componentRef={this.onTextFieldReceivedRef}
        />
        <IconButton
          iconProps={{ iconName: 'Copy' }}
          ariaLabel="Copy to clipboard"
          className={this.clipboardButtonClassName}
        />
      </Wrapper>
    );
  }

  onTextFieldReceivedRef = (ref: ITextField) => {
    // Do a best-effort to try to select the range
    // (Note, doesn't always work -- for example, doesn't work in IE,
    // and also doesn't seem to *always* select)
    if (ref) {
      ref.setSelectionRange(0, -1);
    }
  };
}

export default TextboxClipboardWrapper;
