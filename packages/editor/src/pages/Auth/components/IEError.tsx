import React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import TextboxClipboardWrapper from 'common/lib/components/Clipboard/TextboxClipboardWrapper';

export default () => (
  <div>
    <MessageBar messageBarType={MessageBarType.severeWarning}>
      Script Lab's authentication with GitHub is no longer supported on Internet Explorer.
      Please re-open this URL in an alternate browser, such as Edge, Chrome, Firefox, etc.
    </MessageBar>

    <TextboxClipboardWrapper style={{ marginTop: '2rem' }} text={window.location.href} />
  </div>
);
