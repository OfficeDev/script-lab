import React from "react";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import Only from "common/build/components/Only";

export default ({ additionalInfo }: { additionalInfo?: string }) => (
  <MessageBar messageBarType={MessageBarType.severeWarning}>
    Something went wrong. Please return to the code editor window and try again, or try logging in
    using a different browser.
    <Only when={!!additionalInfo}>
      <div>
        <div style={{ fontStyle: "italic", marginTop: "2.5rem", marginBottom: "1.5rem" }}>
          Additional info:
        </div>
        <div>{additionalInfo}</div>
      </div>
    </Only>
  </MessageBar>
);
