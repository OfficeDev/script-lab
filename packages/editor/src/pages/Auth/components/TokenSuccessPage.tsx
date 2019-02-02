import React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import TextboxClipboardWrapper from 'common/lib/components/TextboxClipboardWrapper';
import { PersonaSize, Persona } from 'office-ui-fabric-react/lib/Persona';

export default ({
  encodedToken,
  username,
  fullName,
  profilePicUrl,
}: {
  encodedToken: string;
  username: string;
  fullName: string;
  profilePicUrl: string;
}) => (
  <>
    <MessageBar messageBarType={MessageBarType.success}>
      Your encoded GitHub auth token is ready. Please copy it from here, and paste it back
      into the code editor window.
    </MessageBar>

    <br />

    <Persona
      imageUrl={profilePicUrl}
      size={PersonaSize.size48}
      text={username}
      secondaryText={fullName}
      showSecondaryText={true}
    />

    <TextboxClipboardWrapper style={{ marginTop: '20px' }} text={encodedToken} />
  </>
);
