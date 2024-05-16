import React from "react";
import { TextField, ITextField } from "office-ui-fabric-react/lib/TextField";

import { Wrapper } from "./styles";
import CopyToClipboardIconButton from "../CopyToClipboardIconButton";

interface IProps {
  text: string;
  style?: React.CSSProperties;
}

class TextboxClipboardWrapper extends React.Component<IProps, {}> {
  render() {
    return (
      <Wrapper style={this.props.style}>
        <TextField
          readOnly={true}
          spellCheck={false}
          value={this.props.text}
          componentRef={this.onTextFieldReceivedRef}
        />
        <CopyToClipboardIconButton textGetter={this.getTextToCopy} />
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
}

export default TextboxClipboardWrapper;
