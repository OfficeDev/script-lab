import React from 'react';
import NodeRSA from 'node-rsa';
import keypair from 'keypair';

import { hideSplashScreen } from 'common/lib/utilities/splash.screen';
import Theme, { ThemeContext } from 'common/lib/components/Theme';
import { HostType } from '@microsoft/office-js-helpers';
import Dialog, { DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import TextboxClipboardWrapper from '../Auth/components/TextboxClipboardWrapper';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { currentEditorUrl } from 'common/lib/environment';
import { PersonaCoin, PersonaSize } from 'office-ui-fabric-react/lib/Persona';

import Only from 'common/lib/components/Only';
import { getProfilePicUrlAndUsername } from '../Editor/services/github';

interface IProps {}

interface IState {
  dialogOpen: boolean;
  authUrl: string;

  encodedToken?: string;
  decodedToken?: string;

  username?: string;
  profilePicUrl?: string;
}

class AuthPageTest extends React.Component<IProps, IState> {
  privateKey: string;

  constructor(props: IProps) {
    super(props);

    // FIXME later is it ok to block while generating the key, or do we need to do it in a worker?
    const pair: { public: string; private: string } = keypair({ bits: 256 });

    console.log('FIXME remove soon');
    console.log('public', pair.public);
    console.log('private', pair.private);

    this.privateKey = pair.private;

    this.state = {
      dialogOpen: true,
      authUrl: currentEditorUrl + '/#/auth?key=' + encodeURIComponent(btoa(pair.public)),
    };
  }

  componentDidMount() {
    hideSplashScreen();
  }

  render() {
    return (
      <Theme host={HostType.WEB}>
        <div style={{ padding: '40px' }}>
          <Dialog
            hidden={!this.state.dialogOpen}
            dialogContentProps={{
              type: DialogType.normal,
              title: 'GitHub Login - Action required',
            }}
            modalProps={{
              isBlocking: true,
              containerClassName: 'ms-dialogMainOverride',
            }}
          >
            <Label>
              To log in with GitHub, you must open the following URL in Edge, Chrome,
              Firefox, or Safari.
            </Label>
            <TextboxClipboardWrapper text={this.state.authUrl} />
            <br />
            <Label>
              After completing the authentication flow in the browser window, please paste
              in the resulting encoded token:
            </Label>
            <TextField onChange={this.onTokenInput} />
            <DialogFooter>
              <PrimaryButton onClick={this.closeDialog} text="Save" />
              <DefaultButton onClick={this.closeDialog} text="Cancel" />
            </DialogFooter>
          </Dialog>

          <TextboxClipboardWrapper
            style={this.state.dialogOpen ? { display: 'none' } : {}}
            text={this.state.decodedToken}
          />

          <Only when={!!this.state.username}>
            <Label>Username: {this.state.username}</Label>
            <ThemeContext.Consumer>
              {theme => (
                <PersonaCoin
                  imageUrl={this.state.profilePicUrl}
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
          </Only>
        </div>
      </Theme>
    );
  }

  closeDialog = () => {
    const decodedToken = new NodeRSA(this.privateKey)
      .decrypt(this.state.encodedToken)
      .toString();
    this.setState({ dialogOpen: false, decodedToken: decodedToken });

    getProfilePicUrlAndUsername(decodedToken).then(data => {
      this.setState({
        username: data.username,
        profilePicUrl: data.profilePicUrl,
      });
    });
  };

  onTokenInput = (_: React.FormEvent<HTMLInputElement>, newValue?: string) =>
    this.setState({ encodedToken: newValue });
}

export default AuthPageTest;

// cspell:ignore keypair
