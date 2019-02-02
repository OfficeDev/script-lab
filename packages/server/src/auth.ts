import request from 'request';

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URL } = process.env;
const GENERIC_ERROR_STRING = 'An unexpected login error has occurred.';

export interface IGithubAccessTokenResponse {
  access_token: string;
  error: string;
  error_description: string;
}

export function getAccessTokenOrErrorResponse({
  code,
  state,
}: {
  code: string;
  state: string;
}) {
  return new Promise(resolve => {
    request.post(
      {
        url: 'https://github.com/login/oauth/access_token',
        headers: {
          Accept: 'application/json',
        },
        json: {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          redirect_uri: GITHUB_REDIRECT_URL,
          code,
          state,
        },
      },
      (error, _httpResponse, body) => {
        resolve(getResultObjectBasedOnAuthResponse(error, body));
      },
    );

    // Helper
    function getResultObjectBasedOnAuthResponse(
      error: any,
      body: IGithubAccessTokenResponse,
    ): { [key: string]: any } {
      if (error) {
        return { error: error };
      } else if (body.error) {
        return { error: body.error + ': ' + body.error_description };
      } else if (body.access_token) {
        return { access_token: body.access_token };
      } else {
        return { error: GENERIC_ERROR_STRING };
      }
    }
  });
}
