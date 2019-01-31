import React from 'react';
import QueryString from 'query-string';
import NodeRSA from 'node-rsa';

import {
  hideSplashScreen,
  invokeGlobalErrorHandler,
} from 'common/lib/utilities/splash.screen';
import { isInternetExplorer, generateCryptoSafeRandom } from 'common/lib/utilities/misc';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import Theme from 'common/lib/components/Theme';
import { HostType } from '@microsoft/office-js-helpers';
import { generateGithubLoginUrl, getProfileInfo } from '../Editor/services/github';
import IEError from './components/IEError';
import SomethingWentWrong from './components/SomethingWentWrong';
import UILessCodeToTokenExchanger from './components/UILessCodeToTokenExchanger';
import OnTokenSuccess from './components/OnTokenSuccess';

const SESSION_STORAGE_AUTH_COMPLETED_PARAMETER = 'auth_completed';
const SESSION_STORAGE_AUTH_KEY_PARAMETER = 'auth_key';
const SESSION_STORAGE_AUTH_STATE_PARAMETER = 'auth_state';

interface IProps {}

interface IState {
  isIE: boolean;
  base64Key: string | undefined;
  hasCodeAndState: boolean;
  error?: string;

  encodedToken?: string;
  username?: string;
  fullName?: string;
  profilePicUrl?: string;
}

interface IPossibleQueryParams {
  // The base64-encoded public key from the taskpane, if arriving on this page the first time
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

    let base64Key: string | undefined;
    if (typeof this.params.key === 'string' && this.params.key.trim().length > 0) {
      base64Key = this.params.key;
      sessionStorage.clear();
    } else {
      base64Key = sessionStorage.getItem(SESSION_STORAGE_AUTH_KEY_PARAMETER); // or undefined
    }

    let error: string;
    if (sessionStorage.getItem(SESSION_STORAGE_AUTH_COMPLETED_PARAMETER)) {
      error =
        "You've already authenticated once on this page. " +
        'If you need to re-authenticate, please close this page, go back to the code editor, ' +
        'and retrieve a new sign-in URL to open in a new page.';
    }

    this.state = {
      isIE,
      base64Key,
      error,
      hasCodeAndState: !error && Boolean(this.params.code && this.params.state),
    };
  }

  render() {
    const {
      component,
      showUI,
    }: { component: React.ReactElement<any>; showUI: boolean } = (() => {
      if (this.state.error) {
        return {
          component: <SomethingWentWrong additionalInfo={this.state.error} />,
          showUI: true,
        };
      }

      if (this.state.encodedToken) {
        return {
          component: (
            <OnTokenSuccess
              encodedToken={this.state.encodedToken}
              username={this.state.username}
              fullName={this.state.fullName}
              profilePicUrl={this.state.profilePicUrl}
            />
          ),
          showUI: true,
        };
      }

      if (this.state.hasCodeAndState) {
        const state = sessionStorage.getItem(SESSION_STORAGE_AUTH_STATE_PARAMETER);
        if (!this.state.base64Key || !state || state !== this.params.state) {
          return {
            component: <SomethingWentWrong />,
            showUI: true,
          };
        }

        return {
          component: (
            <UILessCodeToTokenExchanger
              code={this.params.code}
              state={state}
              onToken={this.onToken}
              onError={this.onError}
            />
          ),
          showUI: false,
        };
      }

      if (this.state.base64Key && !this.state.isIE) {
        const random = generateCryptoSafeRandom();

        sessionStorage.setItem(SESSION_STORAGE_AUTH_KEY_PARAMETER, this.state.base64Key);
        sessionStorage.setItem(SESSION_STORAGE_AUTH_STATE_PARAMETER, random.toString());

        window.location.href = generateGithubLoginUrl(random);
        return { component: null, showUI: false };
      }

      if (!this.state.base64Key) {
        return {
          component: (
            <MessageBar messageBarType={MessageBarType.severeWarning}>
              This page must be opened from a link that contains a "key" parameter in the
              URL. Please go back to the sign-in dialog and be sure to copy the full URL.
            </MessageBar>
          ),
          showUI: true,
        };
      }

      if (this.state.isIE) {
        return {
          component: <IEError />,
          showUI: true,
        };
      }

      return {
        component: <SomethingWentWrong />,
        showUI: true,
      };
    })();

    if (showUI) {
      hideSplashScreen();
    }

    return (
      <Theme host={HostType.WEB}>
        <div style={{ padding: '40px' }}>
          <h1 style={{ marginBottom: '20px', fontSize: '28px', fontWeight: 100 }}>
            Script Lab – Sign in with GitHub
          </h1>
          {component}
        </div>
      </Theme>
    );
  }

  onToken = async (token: string) => {
    getProfileInfo(token)
      .then(({ username, profilePicUrl, fullName }) => {
        const key = this.state.base64Key;
        const encodedToken = new NodeRSA(atob(key)).encrypt(token).toString('base64');
        this.setState({ encodedToken, username, profilePicUrl, fullName });
        window.sessionStorage.setItem(SESSION_STORAGE_AUTH_COMPLETED_PARAMETER, 'true');
      })
      .catch(e => invokeGlobalErrorHandler(e));
  };

  onError = (error: string) => this.setState({ error: error });
}

export default AuthPage;
