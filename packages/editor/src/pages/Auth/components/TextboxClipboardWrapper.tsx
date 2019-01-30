import React from 'react';
import styled from 'styled-components';
import Clipboard from 'clipboard';
import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';
import { TextField, ITextField } from 'office-ui-fabric-react/lib/TextField';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

interface IProps {
  text: string;
  style?: React.CSSProperties;
}

interface IState {}

class TextboxClipboardWrapper extends React.Component<IProps, IState> {
  private clipboard: Clipboard;

  constructor(props: IProps) {
    super(props);

    this.clipboard = new Clipboard('.export-to-clipboard', {
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
            className="export-to-clipboard"
          />
        </OuterStyle>
      </>
    );
  }

  onTextFieldReceivedRef = (ref: ITextField) => ref.setSelectionRange(0, -1);
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
