import axios from 'axios';

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URL } = process.env;
const GENERIC_ERROR_STRING = 'An unexpected login error has occurred.';

export interface IGithubApiAccessTokenResponse {
  access_token: string;
  error: string;
  error_description: string;
}

export function getAccessTokenOrErrorResponse(
  input: IServerAuthRequest,
): Promise<IServerAuthResponse> {
  return new Promise(resolve => {
    const url = 'https://github.com/login/oauth/access_token';
    const data = {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      redirect_uri: GITHUB_REDIRECT_URL,
      code: input.code,
      state: input.state,
    };
    const config = { headers: { Accept: 'application/json' } };

    axios
      .post(url, data, config)
      .then(response => {
        resolve(getResultObjectBasedOnAuthResponse(response.data));
      })
      .catch(error => {
        resolve({ error: error });
      });

    // Helper
    function getResultObjectBasedOnAuthResponse(
      body: IGithubApiAccessTokenResponse,
    ): IServerAuthResponse {
      if (body.error) {
        return { error: body.error + ': ' + body.error_description };
      } else if (body.access_token) {
        return { access_token: body.access_token };
      } else {
        return { error: GENERIC_ERROR_STRING };
      }
    }
  });
}
