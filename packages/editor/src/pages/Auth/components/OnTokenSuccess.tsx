import React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import TextboxClipboardWrapper from 'common/lib/components/TextboxClipboardWrapper';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { ThemeContext } from 'common/lib/components/Theme';
import { PersonaCoin, PersonaSize } from 'office-ui-fabric-react/lib/Persona';

export default ({
  encodedToken,
  username,
  profilePicUrl,
}: {
  encodedToken: string;
  username: string;
  profilePicUrl: string;
}) => {
  debugger;
  return (
    <>
      <MessageBar messageBarType={MessageBarType.success}>
        Your encoded GitHub auth token is ready. Please copy it from here, and paste it
        back into the Code Editor window.
      </MessageBar>

      <Label>Username: {username}</Label>
      <ThemeContext.Consumer>
        {theme => (
          <PersonaCoin
            imageUrl={profilePicUrl}
            size={PersonaSize.size28}
            initialsColor="white"
            styles={{
              initials: {
                color: (theme && theme.primary) || 'black',
              },
            }}
          />
        )}
      </ThemeContext.Consumer>

      <br />
      <TextboxClipboardWrapper style={{ marginTop: '20px' }} text={encodedToken} />
    </>
  );
};
