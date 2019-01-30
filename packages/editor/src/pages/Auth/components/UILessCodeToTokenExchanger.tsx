import React from 'react';
import { currentServerUrl } from 'common/lib/environment';

export interface IProps {
  code: string;
  state: string;
  publicKeyBase64: string;
  onSuccess: (
    data: {
      token: string;
      username: string;
      profilePicUrl: string;
    },
  ) => void;
  onError: (error: string) => void;
}

interface IState {}

class UILessCodeToTokenExchanger extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.startFetchToken();
  }

  render() {
    return null;
  }

  async startFetchToken() {
    try {
      const body = JSON.stringify({
        code: this.props.code,
        state: this.props.state,
        key: this.props.publicKeyBase64,
      });

      const response = await fetch(currentServerUrl + '/auth/encoded', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (response.ok) {
        const data: {
          error?: string;
          encodedToken?: string;
          username: string;
          profilePicUrl: string;
        } = await response.json();
        if (data.error) {
          this.props.onError(data.error);
        } else if (data.encodedToken) {
          debugger;
          this.props.onSuccess({
            token: data.encodedToken,
            username: data.username,
            profilePicUrl: data.profilePicUrl,
          });
        } else {
          this.props.onError("Unexpected error, response doesn't match expected form.");
        }
      } else {
        this.props.onError(response.statusText);
      }
    } catch (error) {
      return { error };
    }
  }
}

export default UILessCodeToTokenExchanger;
