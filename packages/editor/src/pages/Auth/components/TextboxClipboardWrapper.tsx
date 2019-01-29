import React from 'react';
import styled from 'styled-components';
import Clipboard from 'clipboard';
import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

interface IProps {
  text: string;
  style: React.CSSProperties;
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
        <OuterStyle style={this.props.style} className="export-to-clipboard">
          <TextField readOnly={true} value={this.props.text} />
          <IconButton iconProps={{ iconName: 'Copy' }} ariaLabel="Copy to clipboard" />
        </OuterStyle>
      </>
    );
  }
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
