import React from 'react';
import { currentServerUrl } from 'common/lib/environment';

export interface IProps {
  code: string;
  state: string;
  onToken: (token: string) => void;
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
      });

      const response = await fetch(currentServerUrl + '/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (response.ok) {
        const data: {
          error?: string;
          access_token?: string;
        } = await response.json();
        if (data.error) {
          this.props.onError(data.error);
        } else if (data.access_token) {
          this.props.onToken(data.access_token);
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
