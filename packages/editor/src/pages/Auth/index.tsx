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

const KEY_QUERY_PARAMETER = 'key';
const SESSION_STORAGE_AUTH_KEY_PARAMETER = 'auth_key';
const SESSION_STORAGE_STATE_PARAMETER = 'auth_state';

interface IProps {}

interface IState {
  isIE: boolean;
  key: string | undefined;
}

class AuthPage extends React.Component<IProps, IState> {
  private clipboard: Clipboard;

  constructor(props: IProps) {
    super(props);

    const isIE = isInternetExplorer();

    const possibleKey: any = QueryString.parse(QueryString.extract(window.location.href))[
      KEY_QUERY_PARAMETER
    ];
    let key: string | undefined;
    if (typeof possibleKey === 'string' && possibleKey.trim().length > 0) {
      key = possibleKey;
    }

    this.state = {
      isIE,
      key,
    };

    this.clipboard = new Clipboard('.export-to-clipboard');
    this.clipboard.on('error', invokeGlobalErrorHandler);
  }

  componentDidMount() {
    const shouldNavigateAway = this.state.key && !this.state.isIE;

    if (shouldNavigateAway) {
      const random = generateCryptoSafeRandom();

      sessionStorage.setItem(SESSION_STORAGE_AUTH_KEY_PARAMETER, this.state.key);
      sessionStorage.setItem(SESSION_STORAGE_STATE_PARAMETER, random.toString());

      window.location.href = generateGithubLoginUrl(random);
      return;
    }

    // Otherwise, render and hide the splash screen:
    hideSplashScreen();
  }

  render() {
    const renderInner = () => {
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
              <TextField
                readOnly={true}
                value={window.location.href}
                id="url-textfield"
              />
              <IconButton
                iconProps={{ iconName: 'Copy' }}
                ariaLabel="Copy to clipboard"
                data-clipboard-target="#url-textfield"
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
