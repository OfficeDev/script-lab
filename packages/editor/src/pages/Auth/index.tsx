import React from 'react';
import QueryString from 'query-string';

import { hideSplashScreen } from 'common/lib/utilities/splash.screen';
import { isInternetExplorer, generateCryptoSafeRandom } from '../../utils';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import Theme from 'common/lib/components/Theme';
import { HostType } from '@microsoft/office-js-helpers';
import { generateGithubLoginUrl } from '../Editor/services/github';
import TextboxClipboardWrapper from './components/TextboxClipboardWrapper';
import IEError from './components/IEError';

const SESSION_STORAGE_AUTH_KEY_PARAMETER = 'auth_key';
const SESSION_STORAGE_AUTH_STATE_PARAMETER = 'auth_state';

interface IProps {}

interface IState {
  isIE: boolean;
  key: string | undefined;
  hasCodeAndState: boolean;
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
  params: IPossibleQueryParams;

  constructor(props: IProps) {
    super(props);

    const isIE = isInternetExplorer();

    this.params = QueryString.parse(QueryString.extract(window.location.href));

    let key: string | undefined;
    if (typeof this.params.key === 'string' && this.params.key.trim().length > 0) {
      key = this.params.key;
    }

    this.state = {
      isIE,
      key,
      hasCodeAndState: Boolean(this.params.code && this.params.state),
    };
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

    if (this.state.hasCodeAndState) {
      // Don't hide the splash screen quite yet, need to exchange it for the token first.
      // Will hide it once the call to the server is finished.
    } else {
      hideSplashScreen();
    }
  }

  render() {
    const renderInner = () => {
      if (this.state.hasCodeAndState) {
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
        return <IEError />;
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
