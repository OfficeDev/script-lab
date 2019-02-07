import React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import TextboxClipboardWrapper from 'common/lib/components/Clipboard/TextboxClipboardWrapper';
import { PersonaSize, Persona } from 'office-ui-fabric-react/lib/Persona';

interface IProps {
  encodedToken: string;
  username: string;
  fullName: string;
  profilePicUrl: string;
}
export default ({ encodedToken, username, fullName, profilePicUrl }: IProps) => (
  <div>
    <MessageBar messageBarType={MessageBarType.success}>
      Your encoded GitHub auth token is ready. Please copy it from here, and paste it back
      into the code editor window.
    </MessageBar>

    <Persona
      styles={{
        root: {
          marginTop: '2rem',
        },
      }}
      imageUrl={profilePicUrl}
      size={PersonaSize.size48}
      text={username}
      secondaryText={fullName}
      showSecondaryText={true}
    />

    <TextboxClipboardWrapper style={{ marginTop: '2rem' }} text={encodedToken} />
  </div>
);
