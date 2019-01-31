import React from 'react';
import styled from 'styled-components';
import Clipboard from 'clipboard';
import { TextField, ITextField } from 'office-ui-fabric-react/lib/TextField';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { invokeGlobalErrorHandler } from '../../utilities/splash.screen';
import { generateCryptoSafeRandom } from '../../utilities/misc';

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
      <>
        <OuterStyle style={this.props.style}>
          <TextField
            readOnly={true}
            value={this.props.text}
            componentRef={this.onTextFieldReceivedRef}
          />
          <IconButton
            iconProps={{ iconName: 'Copy' }}
            ariaLabel="Copy to clipboard"
            className={this.clipboardButtonClassName}
          />
        </OuterStyle>
      </>
    );
  }

  onTextFieldReceivedRef = (ref: ITextField) => {
    if (ref) {
      ref.setSelectionRange(0, -1);
    }
  };
}

export default TextboxClipboardWrapper;

///////////////////////////////////////

const OuterStyle = styled.div`
  display: flex;
  border: 1px gray solid;
  border-radius: 4px;

  & > :nth-child(1) {
    flex: 1;
  }
`;
