import React from 'react';
import { connect } from 'react-redux'; // Note, avoid the temptation to include '@types/react-redux', it will break compile-time!
import { hideSplashScreen } from 'common/lib/utilities/splash.screen';
import Dialog, { DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';

import TextboxClipboardWrapper from 'common/lib/components/Clipboard/TextboxClipboardWrapper';
import { currentEditorUrl } from 'common/lib/environment';
import {
  bufferToHexString,
  hexStringToBuffer,
  bufferToUnicodeString,
} from 'common/lib/utilities/array.buffer';

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

// Define "crypto" variable for use by this component,
// using either "window.crypto" or the IE11-specific msCrypto.
const crypto: Crypto = window.crypto || (window as any).msCrypto;

class BrowserAuthDialog extends React.Component<IProps, IState> {
  privateKey: CryptoKey;
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

  onDialogShown = async () => {
    if (!this.keyGenerationInProgress) {
      this.keyGenerationInProgress = true;

      try {
        const pair = await promisifyCryptoAction<CryptoKeyPair>(
          crypto.subtle.generateKey(
            {
              name: 'RSA-OAEP',
              modulusLength: 2048,
              publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
              hash: { name: 'SHA-256' },
            },
            true,
            ['encrypt', 'decrypt'],
          ),
        );

        this.privateKey = pair.privateKey;

        this.setState({
          authUrl:
            currentEditorUrl +
            '/#/auth?key=' +
            bufferToHexString(
              await promisifyCryptoAction<ArrayBuffer>(
                crypto.subtle.exportKey('spki', pair.publicKey),
              ),
            ),
        });
      } catch (error) {
        this.setState({ errorMessage: error.toString() });
      }
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

  onTokenInput = async (_: React.FormEvent<HTMLInputElement>, newValue?: string) => {
    this.setState({ encodedToken: newValue, errorMessage: null, decodedToken: null });
    if (newValue) {
      try {
        const decryptedArrayBuffer = await promisifyCryptoAction<ArrayBuffer>(
          crypto.subtle.decrypt(
            {
              name: 'RSA-OAEP',
              hash: { name: 'SHA-256' },
            } as any /* note: hash is necessary for msCrypto */,
            this.privateKey,
            hexStringToBuffer(newValue),
          ),
        );

        this.setState({ decodedToken: bufferToUnicodeString(decryptedArrayBuffer) });
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

///////////////////////////////////////

function promisifyCryptoAction<T>(
  operation: IOncompleteOnerror<T> | PromiseLike<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    if ((window as any).msCrypto) {
      (operation as IOncompleteOnerror<T>).onerror = error => reject(error);
      (operation as IOncompleteOnerror<T>).oncomplete = event =>
        resolve(event.target.result);
    } else {
      (operation as PromiseLike<T>).then(
        result => resolve(result),
        error => reject(error),
      );
    }
  });
}

interface IOncompleteOnerror<T> {
  onerror: (e: any) => void;
  oncomplete: (event: { target: { result: T } }) => void;
}
