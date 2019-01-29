import React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export default ({ additionalInfo }: { additionalInfo?: string }) => (
  <MessageBar messageBarType={MessageBarType.severeWarning}>
    Something went wrong. Please return to the login dialog and try again.
    {additionalInfo ? (
      <div>
        <br />
        <br />
        <div style={{ fontStyle: 'italic' }}>Additional info:</div>
        <br />
        <div>{additionalInfo}</div>
      </div>
    ) : null}
  </MessageBar>
);
