import React from 'react';
import { connect } from 'react-redux'; // Note, avoid the temptation to include '@types/react-redux', it will break compile-time!
import NodeRSA from 'node-rsa';
import forge from 'node-forge';

import { hideSplashScreen } from 'common/lib/utilities/splash.screen';
import Dialog, { DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';

import TextboxClipboardWrapper from 'common/lib/components/Clipboard/TextboxClipboardWrapper';
import { currentEditorUrl } from 'common/lib/environment';

import { actions } from '../../../store';
import { IGithubProcessedLoginInfo } from '../../../store/github/actions';
import { getProfileInfo } from '../../../services/github';

import { createStructuredSelector } from 'reselect';
import selectors from '../../../store/selectors';

interface IProps {
  isOpen: boolean;
  cancel: () => void;
  onLoginSuccess: (info: IGithubProcessedLoginInfo) => void;
}

interface IState {
  authUrl?: string;

  errorMessage?: string;

  encodedToken?: string;
  decodedToken?: string;
}

class BrowserAuthDialog extends React.Component<IProps, IState> {
  privateKey: NodeRSA;
  keyGenerationInProgress: boolean;
  state: IState = {};

  componentDidMount() {
    hideSplashScreen();
  }

  render() {
    return (
      <Dialog
        hidden={!this.props.isOpen}
        onDismiss={this.props.cancel}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Action required',
        }}
        modalProps={{
          isBlocking: true,
          layerProps: {
            onLayerDidMount: this.onDialogShown,
          },
        }}
      >
        {!this.state.authUrl ? (
          <Label>
            Please wait while we prepare the authentication dialog. This may take a few
            seconds...
          </Label>
        ) : (
          <>
            <Label>
              To log in with GitHub, please open the following URL in a browser window:
            </Label>
            <TextboxClipboardWrapper text={this.state.authUrl} />

            <Label styles={{ root: { marginTop: '1.5rem' } }}>
              After completing the authentication flow, paste in the resulting token:
            </Label>
            <TextField
              placeholder="<Paste token here>"
              onChange={this.onTokenInput}
              errorMessage={this.state.errorMessage}
              iconProps={
                this.state.decodedToken
                  ? {
                      iconName: 'Checkmark',
                    }
                  : {}
              }
              required={
                /* show required asterisk until it's already been fulfilled */
                !this.state.decodedToken
              }
              onKeyPress={this.onEnterKeyPress}
            />
          </>
        )}
        <DialogFooter>
          <PrimaryButton onClick={this.onOk} disabled={!this.shouldAllowOk()} text="OK" />
          <DefaultButton onClick={this.props.cancel} text="Cancel" />
        </DialogFooter>
      </Dialog>
    );
  }

  onDialogShown = () => {
    if (!this.keyGenerationInProgress) {
      this.keyGenerationInProgress = true;

      forge.pki.rsa.generateKeyPair(
        {
          bits: 2048,
          workers: 2 /* number of web workers to use */,
        },
        (err, keypair) => {
          if (err) {
            this.setState({ errorMessage: err.toString() });
            return;
          }

          const publicKeyString = forge.pki.publicKeyToPem(keypair.publicKey);
          const privateKeyString = forge.pki.privateKeyToPem(keypair.privateKey);

          this.privateKey = new NodeRSA(privateKeyString);

          this.setState({
            authUrl:
              currentEditorUrl +
              '/#/auth?key=' +
              encodeURIComponent(btoa(publicKeyString)),
          });
        },
      );
    }

    // Clear out any previous error state, or the token input
    this.setState({
      errorMessage: null,
      encodedToken: null,
      decodedToken: null,
    });
  };

  shouldAllowOk = () => Boolean(!this.state.errorMessage && this.state.encodedToken);

  onOk = async () => {
    try {
      const profileInfo = await getProfileInfo(this.state.decodedToken);
      this.props.onLoginSuccess(profileInfo);
    } catch (e) {
      this.setState({
        errorMessage:
          `The encrypted token is invalid. ` +
          `Please make sure you pasted the full token, and that it's ` +
          `from a recent invocation of the auth URL. ` +
          `If it still isn't working, try going through the auth flow again.`,
      });
    }
  };

  onTokenInput = (_: React.FormEvent<HTMLInputElement>, newValue?: string) => {
    this.setState({ encodedToken: newValue, errorMessage: null });
    if (newValue) {
      try {
        this.setState({ decodedToken: this.privateKey.decrypt(newValue).toString() });
      } catch (e) {
        // If it doesn't work, that's OK.  This is only used for visual indication
        // when the user pasted in the token -- they'll see the actual error message
        // when they press "OK", and until then we don't want to be obtrusive.
      }
    }
  };

  onEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.onOk();
    }
  };
}

export default connect(
  createStructuredSelector({
    isOpen: selectors.github.getIsAuthDialogOpen,
  }),
  { onLoginSuccess: actions.github.loginSuccessful, cancel: actions.github.cancelLogin },
)(BrowserAuthDialog);

// cspell:ignore keypair
