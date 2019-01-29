import React from 'react';
import QueryString from 'query-string';

import { hideSplashScreen } from 'common/lib/utilities/splash.screen';
import { isInternetExplorer, generateCryptoSafeRandom } from '../../utils';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import Theme from 'common/lib/components/Theme';
import { HostType } from '@microsoft/office-js-helpers';
import { generateGithubLoginUrl } from '../Editor/services/github';
import IEError from './components/IEError';
import SomethingWentWrong from './components/SomethingWentWrong';
import UILessCodeToTokenExchanger from './components/UILessCodeToTokenExchanger';
import EncodedToken from './components/EncodedToken';

const SESSION_STORAGE_AUTH_KEY_PARAMETER = 'auth_key';
const SESSION_STORAGE_AUTH_STATE_PARAMETER = 'auth_state';

interface IProps {}

interface IState {
  isIE: boolean;
  key: string | undefined;
  hasCodeAndState: boolean;
  encodedToken?: string;
  error?: string;
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
          component: <EncodedToken encodedToken={this.state.encodedToken} />,
          showUI: true,
        };
      }

      if (this.state.hasCodeAndState) {
        const key = sessionStorage.getItem(SESSION_STORAGE_AUTH_KEY_PARAMETER);
        const state = sessionStorage.getItem(SESSION_STORAGE_AUTH_STATE_PARAMETER);
        if (!key || !state || state !== this.params.state) {
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
              publicKey={key}
              onToken={this.onToken}
              onError={this.onError}
            />
          ),
          showUI: false,
        };
      }

      if (this.state.key && !this.state.isIE) {
        const random = generateCryptoSafeRandom();

        sessionStorage.setItem(SESSION_STORAGE_AUTH_KEY_PARAMETER, this.state.key);
        sessionStorage.setItem(SESSION_STORAGE_AUTH_STATE_PARAMETER, random.toString());

        window.location.href = generateGithubLoginUrl(random);
        return { component: null, showUI: false };
      }

      if (!this.state.key) {
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

  onToken = (token: string) => this.setState({ encodedToken: token });
  onError = (error: string) => this.setState({ error: error });
}

export default AuthPage;
