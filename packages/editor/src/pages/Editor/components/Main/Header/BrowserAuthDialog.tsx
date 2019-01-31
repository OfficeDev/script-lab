import React from 'react';
import { connect } from 'react-redux';
import NodeRSA from 'node-rsa';
import keypair from 'keypair';

import { hideSplashScreen } from 'common/lib/utilities/splash.screen';
import Dialog, { DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';

import TextboxClipboardWrapper from 'common/lib/components/TextboxClipboardWrapper';
import { currentEditorUrl } from 'common/lib/environment';
import Only from 'common/lib/components/Only';

import { actions } from '../../../store';
import { IGithubProcessedLoginInfo } from '../../../store/github/actions';
import { getProfileInfo } from '../../../services/github';

interface IProps {
  isOpen: boolean;
  hide: () => void;
  onLoginSuccess: (info: IGithubProcessedLoginInfo) => void;
}

interface IState {
  authUrl: string;

  errorMessage?: string;

  encodedToken?: string;
  decodedToken?: string;
}

class BrowserAuthDialog extends React.Component<IProps, IState> {
  privateKey: NodeRSA;

  constructor(props: IProps) {
    super(props);

    // FIXME later is it ok to block while generating the key, or do we need to do it in a worker?
    const pair: { public: string; private: string } = keypair();
    // const pair: { public: string; private: string } = keypair({ bits: 512 });

    this.privateKey = new NodeRSA(pair.private);

    this.state = {
      authUrl: currentEditorUrl + '/#/auth?key=' + encodeURIComponent(btoa(pair.public)),
    };
  }

  componentDidMount() {
    hideSplashScreen();
  }

  render() {
    // FIXME how to add "esc" to cancel?

    return (
      <Dialog
        hidden={!this.props.isOpen}
        onDismiss={this.props.hide}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Script Lab – Sign in with GitHub',
        }}
        modalProps={{
          containerClassName: 'ms-dialogMainOverride',
        }}
      >
        <Label>
          To log in with GitHub, you must open the following URL in Edge, Chrome, Firefox,
          or Safari.
        </Label>
        <TextboxClipboardWrapper text={this.state.authUrl} />
        <br />
        <Label>
          After completing the authentication flow in the browser window, please paste in
          the resulting encoded token:
        </Label>
        <TextField
          placeholder="<Paste encoded token here>"
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
        />
        <DialogFooter>
          <PrimaryButton onClick={this.onOk} disabled={!this.showOkButton()} text="OK" />

          <DefaultButton onClick={this.props.hide} text="Cancel" />
        </DialogFooter>
      </Dialog>
    );
  }

  showOkButton = () => Boolean(!this.state.errorMessage && this.state.encodedToken);

  onOk = async () => {
    try {
      const profileInfo = await getProfileInfo(this.state.decodedToken);
      this.props.onLoginSuccess(profileInfo);
      this.props.hide();

      // Since this dialog is re-used if brought back up, clear out the encrypted and decoded token
      // (so that if log out, open this dialog, leave everything empty and press OK, that don't get
      // re-logged in)
      this.setState({
        encodedToken: null,
        decodedToken: null,
        errorMessage: null,
      });
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
}

export default connect(
  null,
  { onLoginSuccess: actions.github.login.success },
)(BrowserAuthDialog);

// cspell:ignore keypair
