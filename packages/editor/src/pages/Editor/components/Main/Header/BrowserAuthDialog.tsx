import React from 'react';
import { connect } from 'react-redux';
import NodeRSA from 'node-rsa';
import keypair from 'keypair';

import {
  hideSplashScreen,
  invokeGlobalErrorHandler,
} from 'common/lib/utilities/splash.screen';
import Dialog, { DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';

import TextboxClipboardWrapper from 'common/lib/components/TextboxClipboardWrapper';
import { currentEditorUrl } from 'common/lib/environment';

import { actions } from '../../../store';
import { IGithubLoginInfo } from '../../../store/github/actions';
import { getProfilePicUrlAndUsername } from '../../../services/github';

interface IProps {
  isOpen: boolean;
  hide: () => void;
  onLoginSuccess: (info: IGithubLoginInfo) => void;
}

interface IState {
  dialogOpen: boolean;
  authUrl: string;

  encodedToken?: string;
  decodedToken?: string;

  username?: string;
  profilePicUrl?: string;
}

class BrowserAuthDialog extends React.Component<IProps, IState> {
  privateKey: string;

  constructor(props: IProps) {
    super(props);

    // FIXME later is it ok to block while generating the key, or do we need to do it in a worker?
    const pair: { public: string; private: string } = keypair();

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
      <Dialog
        hidden={!this.props.isOpen}
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
          To log in with GitHub, you must open the following URL in Edge, Chrome, Firefox,
          or Safari.
        </Label>
        <TextboxClipboardWrapper text={this.state.authUrl} />
        <br />
        <Label>
          After completing the authentication flow in the browser window, please paste in
          the resulting encoded token:
        </Label>
        <TextField onChange={this.onTokenInput} />
        <DialogFooter>
          <PrimaryButton
            onClick={this.onOk}
            placeholder="Paste your encoded token here"
            text="OK"
          />
          <DefaultButton onClick={this.props.hide} text="Cancel" />
        </DialogFooter>
      </Dialog>
    );
  }

  onOk = () => {
    // FIXME close
    const decodedToken = new NodeRSA(this.privateKey)
      .decrypt(this.state.encodedToken)
      .toString();
    this.setState({ dialogOpen: false, decodedToken: decodedToken });

    // FIXME: after validating can call hide.
    getProfilePicUrlAndUsername(decodedToken)
      .then(data => {
        this.props.hide();
        this.props.onLoginSuccess({
          token: decodedToken,
          username: data.username,
          profilePicUrl: data.profilePicUrl,
        });
      })
      .catch(e => invokeGlobalErrorHandler(e) /* FIXME */);
  };

  onTokenInput = (_: React.FormEvent<HTMLInputElement>, newValue?: string) =>
    this.setState({ encodedToken: newValue });
}

export default connect(
  null,
  { onLoginSuccess: actions.github.login.success },
)(BrowserAuthDialog);

// cspell:ignore keypair
