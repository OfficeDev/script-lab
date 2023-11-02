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
  let postRequest = new Promise((resolve, reject) => {
    const url = 'https://github.com/login/oauth/access_token';
    const data = {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      redirect_uri: GITHUB_REDIRECT_URL,
      code: input.code,
      state: input.state,
    };

    let request = new XMLHttpRequest();

    request.addEventListener('readystatechange', () => {
      if (request.readyState === 4 && request.status === 200) {
        let responseData: IGithubApiAccessTokenResponse = JSON.parse(
          request.responseText,
        );
        resolve(responseData);
      } else if (request.readyState === 4) {
        reject('Failure retrieving data');
      }
    });

    request.open('POST', url);
    request.setRequestHeader('Accept', 'application/json');
    request.send(data);
  });
  return postRequest
    .then(response => {
      return getResultObjectBasedOnAuthResponse(
        response as IGithubApiAccessTokenResponse,
      );
    })
    .catch(() => {
      return { error: GENERIC_ERROR_STRING };
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
}
