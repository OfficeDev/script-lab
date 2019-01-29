import React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import TextboxClipboardWrapper from './TextboxClipboardWrapper';

export default ({ encodedToken }: { encodedToken: string }) => (
  <>
    <MessageBar messageBarType={MessageBarType.success}>
      Your encoded GitHub auth token is ready. Please copy-paste it back into the Code
      Editor window.
    </MessageBar>

    <TextboxClipboardWrapper style={{ marginTop: '20px' }} text={encodedToken} />
  </>
);
