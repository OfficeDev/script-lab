import React from 'react';
import QueryString from 'query-string';
import Clipboard from 'clipboard';

import {
  hideSplashScreen,
  invokeGlobalErrorHandler,
} from 'common/lib/utilities/splash.screen';
import { isInternetExplorer, generateCryptoSafeRandom } from '../../utils';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import Theme from 'common/lib/components/Theme';
import { HostType } from '@microsoft/office-js-helpers';
import { TextBoxClipboardWrapper } from './styles';
import { generateGithubLoginUrl } from '../Editor/services/github';

const SESSION_STORAGE_AUTH_KEY_PARAMETER = 'auth_key';
const SESSION_STORAGE_AUTH_STATE_PARAMETER = 'auth_state';

interface IProps {}

interface IState {
  isIE: boolean;
  key: string | undefined;
  isCompleted: boolean;
  textToCopy: string;
}

interface IPossibleQueryParams {
  // The public key from the taskpane, if arriving on this page the first time
  key?: string;

  // Code from GitHub, if auth is successful
  code?: string;
  // State from GitHub, if auth is successful
  state?: string;
}

class AuthPage extends React.Component<IProps, IState> {
  private clipboard: Clipboard;
  params: IPossibleQueryParams;

  constructor(props: IProps) {
    super(props);

    const isIE = isInternetExplorer();

    this.params = QueryString.parse(QueryString.extract(window.location.href));

    let key: string | undefined;
    if (typeof this.params.key === 'string' && this.params.key.trim().length > 0) {
      key = this.params.key;
    }

    const isCompleted = Boolean(this.params.code && this.params.state);

    this.state = {
      isIE,
      key,
      isCompleted,
      textToCopy: isIE ? window.location.href : 'FIXME',
    };

    this.clipboard = new Clipboard('.export-to-clipboard', {
      text: () => this.state.textToCopy, // FIXME
    });
    this.clipboard.on('error', invokeGlobalErrorHandler);
  }

  componentDidMount() {
    const shouldNavigateAway = this.state.key && !this.state.isIE;

    if (shouldNavigateAway) {
      const random = generateCryptoSafeRandom();

      sessionStorage.setItem(SESSION_STORAGE_AUTH_KEY_PARAMETER, this.state.key);
      sessionStorage.setItem(SESSION_STORAGE_AUTH_STATE_PARAMETER, random.toString());

      window.location.href = generateGithubLoginUrl(random);
      return;
    }

    // Otherwise, render and hide the splash screen:
    hideSplashScreen();
  }

  render() {
    const renderInner = () => {
      if (this.state.isCompleted) {
        const key = sessionStorage.getItem(SESSION_STORAGE_AUTH_KEY_PARAMETER);
        const state = sessionStorage.getItem(SESSION_STORAGE_AUTH_STATE_PARAMETER);
        if (!key || !state || state !== this.params.state) {
          return (
            <MessageBar messageBarType={MessageBarType.severeWarning}>
              Something went wrong. Please return to the login dialog and try again.
            </MessageBar>
          );
        }

        return <div>FIXME, now need to exchange the code...</div>;
      }

      if (!this.state.key) {
        return (
          <MessageBar messageBarType={MessageBarType.severeWarning}>
            This page must be opened from a link that contains a "key" parameter in the
            URL. Please go back to the sign-in dialog and be sure to copy the full URL.
          </MessageBar>
        );
      }

      if (this.state.isIE) {
        return (
          <>
            <MessageBar messageBarType={MessageBarType.severeWarning}>
              Script Lab's authentication with GitHub is no longer supported on Internet
              Explorer. Please re-open this URL in an alternate browser, such as Edge,
              Chrome, Firefox, etc.
            </MessageBar>
            <TextBoxClipboardWrapper style={{ marginTop: '20px' }}>
              <TextField readOnly={true} value={window.location.href} />
              <IconButton
                iconProps={{ iconName: 'Copy' }}
                ariaLabel="Copy to clipboard"
              />
            </TextBoxClipboardWrapper>
          </>
        );
      }
    };

    return (
      <Theme host={HostType.WEB}>
        <div style={{ padding: '40px' }}>
          <h1 style={{ marginBottom: '20px', fontSize: '28px', fontWeight: 100 }}>
            Script Lab – Sign in with GitHub
          </h1>
          {renderInner()}
        </div>
      </Theme>
    );
  }
}

export default AuthPage;
