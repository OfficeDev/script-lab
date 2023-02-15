import React from 'react';
import queryString from 'query-string';

import {
  hideSplashScreen,
  invokeGlobalErrorHandler,
} from 'common/lib/utilities/splash.screen';
import { isInternetExplorer, generateRandomToken } from 'common/lib/utilities/misc';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import Theme from 'common/lib/components/Theme';
import { HostType } from '@microsoft/office-js-helpers';
import { generateGithubLoginUrl, getProfileInfo } from '../Editor/services/github';
import IEError from './components/IEError';
import SomethingWentWrong from './components/SomethingWentWrong';
import TokenSuccessPage from './components/TokenSuccessPage';
import Dialog, { DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { RunOnLoad } from 'common/lib/components/PageSwitcher/utilities/RunOnLoad';
import { currentServerUrl } from 'common/lib/environment';

import {
  bufferToHexString,
  hexStringToBuffer,
  unicodeStringToBuffer,
} from 'common/lib/utilities/array.buffer';

const AUTH_PAGE_SESSION_STORAGE_KEYS = {
  auth_completed: 'auth_completed',
  auth_key: 'auth_key',
  auth_state: 'auth_state',
};

interface IProps {}

interface IState {
  isIE: boolean;
  publicKeyString: string;
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

    this.params = queryString.parse(queryString.extract(window.location.href));

    let publicKeyString: string | undefined;
    if (this.params.key && this.params.key.trim().length > 0) {
      publicKeyString = this.params.key;

      // If landed on the page and have a "key" query parameter, the window
      // might be re-used for a new auth flow.  So just in case,
      // clear the session storage, and then store the key parameter
      Object.values(AUTH_PAGE_SESSION_STORAGE_KEYS).forEach(keyName =>
        sessionStorage.removeItem(keyName),
      );

      sessionStorage.setItem(AUTH_PAGE_SESSION_STORAGE_KEYS.auth_key, publicKeyString);
    } else {
      // Get from storage (or just have it resolve to null if it's not present)
      publicKeyString = sessionStorage.getItem(AUTH_PAGE_SESSION_STORAGE_KEYS.auth_key);
    }

    let error: string;
    if (sessionStorage.getItem(AUTH_PAGE_SESSION_STORAGE_KEYS.auth_completed)) {
      error =
        "You've already authenticated once on this page. " +
        'If you need to re-authenticate, please close this page, go back to the code editor, ' +
        'and retrieve a new sign-in URL to open in a new page.';
    }

    this.state = {
      isIE,
      publicKeyString,
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
            <TokenSuccessPage
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
        const state = sessionStorage.getItem(AUTH_PAGE_SESSION_STORAGE_KEYS.auth_state);
        if (!this.state.publicKeyString || !state || state !== this.params.state) {
          console.error(
            'Something went wrong: have code and state on the URL query string, ' +
              "but don't seem to have it in session storage!",
          );
          return {
            component: <SomethingWentWrong />,
            showUI: true,
          };
        }

        return {
          component: <RunOnLoad funcToRun={this.exchangeCodeAndStateForAccessToken} />,
          showUI: false,
        };
      }

      if (this.state.publicKeyString && !this.state.isIE) {
        // Before navigating away, kick off a process to ensure that the key is
        // actually valid (e.g., that it wasn't accidentally cut off during copy-paste)
        reconstructPublicKey(this.state.publicKeyString)
          .then(_ => {
            const random = generateRandomToken();

            sessionStorage.setItem(AUTH_PAGE_SESSION_STORAGE_KEYS.auth_state, random);

            window.location.href = generateGithubLoginUrl(random);
          })
          .catch(e => {
            this.setState({
              error:
                `The "key" parameter in the URL appears to be incomplete. ` +
                `Please go back to the sign-in dialog in the code editor, and be sure to copy the full URL.`,
            });
          });

        return { component: null, showUI: false };
      }

      if (!this.state.publicKeyString) {
        return {
          component: (
            <MessageBar messageBarType={MessageBarType.severeWarning}>
              This page must be opened from a link that contains a key parameter in the
              URL. Please go back to the sign-in dialog in the code editor, and be sure to
              copy the full URL.
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

      console.error('Something went wrong -- fell through the other cases');
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
        <Dialog
          hidden={false}
          minWidth="350px"
          dialogContentProps={{
            type: DialogType.normal,
            title: 'Script Lab – Sign in with GitHub',
          }}
          modalProps={{
            isBlocking: true,
          }}
        >
          {component}
        </Dialog>
      </Theme>
    );
  }

  private exchangeCodeAndStateForAccessToken = async () => {
    try {
      const input: IServerAuthRequest = {
        code: this.params.code,
        state: sessionStorage.getItem(AUTH_PAGE_SESSION_STORAGE_KEYS.auth_state),
      };

      const response = await fetch(currentServerUrl + '/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (response.ok) {
        const data: IServerAuthResponse = await response.json();
        if (data.error) {
          this.onError(data.error);
        } else if (data.access_token) {
          this.onToken(data.access_token);
        } else {
          this.onError("Unexpected error, response doesn't match expected form.");
        }
      } else {
        this.onError(response.statusText);
      }
    } catch (error) {
      this.onError(error);
    }
  };

  private onToken = async (token: string) => {
    try {
      const { username, profilePicUrl, fullName } = await getProfileInfo(token);
      const publicKey = await reconstructPublicKey(this.state.publicKeyString);

      // Note: can use "crypto" directly here because by the time get to this code,
      // don't need to worry about IE11.
      // However, still need the "hash" parameter since Edge requires it
      //   (see https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12782429/)
      const encryptedArrayBuffer = await crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP',
          hash: { name: 'SHA-256' } /* See note above for why it's needed */,
        } as any,
        publicKey,
        unicodeStringToBuffer(token),
      );
      const encodedToken = bufferToHexString(encryptedArrayBuffer);
      this.setState({ encodedToken, username, profilePicUrl, fullName });
      window.sessionStorage.setItem(
        AUTH_PAGE_SESSION_STORAGE_KEYS.auth_completed,
        'true',
      );
    } catch (e) {
      invokeGlobalErrorHandler(e);
    }
  };

  private onError = (error: string) => this.setState({ error: error });
}

export default AuthPage;

///////////////////////////////////////

function reconstructPublicKey(numericString: string): Promise<CryptoKey> {
  return new Promise(async (resolve, reject) => {
    try {
      // Note: can use "crypto" directly here because by the time get to this code,
      // don't need to worry about IE11.
      const value = await crypto.subtle.importKey(
        'spki',
        hexStringToBuffer(numericString),
        { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
        false,
        ['encrypt'],
      );
      return resolve(value);
    } catch (reason) {
      return reject(reason);
    }
  });
}
