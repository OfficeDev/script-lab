import { Authenticator, IToken } from '@microsoft/office-js-helpers';
import { request as generalRequest, IResponseOrError } from './general';
import { currentServerUrl, githubAppClientId } from 'common/lib/environment';

const baseApiUrl = 'https://api.github.com';

interface IRequest {
  method: string;
  path: string;
  token?: string;
  jsonPayload?: string;
}

const auth = new Authenticator();

auth.endpoints.add('GitHub', {
  clientId: githubAppClientId,
  baseUrl: 'https://github.com/login',
  authorizeUrl: '/oauth/authorize',
  scope: 'gist',
  state: true,
  tokenUrl: `${currentServerUrl}/auth`,
});

export const request = async ({
  method,
  path,
  token,
  jsonPayload,
  isArrayResponse,
}: IRequest & { isArrayResponse: boolean }): Promise<IResponseOrError> => {
  let nextUrl = `${baseApiUrl}/${path}`;
  let aggregate = [];

  while (nextUrl) {
    const { response, headers, error } = await generalRequest({
      url: nextUrl,
      method,
      token,
      jsonPayload,
    });

    if (error) {
      return { error };
    }

    if (!isArrayResponse) {
      return { response };
    }

    aggregate = [...aggregate, ...response];
    nextUrl = getNextLinkIfAny(headers.get('Link'));
  }

  debugger;
  return { response: aggregate };
};

export const login = async (): Promise<{
  token?: string;
  profilePicUrl?: string;
  username?: string;
}> => {
  let iToken: IToken;
  try {
    iToken = await auth.authenticate('GitHub');
  } catch (err) {
    console.error(err);
    throw err;
  }
  const token = iToken.access_token;

  return {
    token,
    ...(await getProfilePicUrlAndUsername(token)),
  };
};

export const getProfilePicUrlAndUsername = (
  token: string,
): Promise<{ profilePicUrl?: string; username?: string }> =>
  request({
    method: 'GET',
    path: 'user',
    token,
    isArrayResponse: false,
  }).then(({ response, error }) => {
    if (error) {
      console.error(error);
      return {};
    } else {
      return {
        profilePicUrl: response!.avatar_url,
        username: response!.login,
      };
    }
  });

export const logout = () => auth.tokens.clear();

function getNextLinkIfAny(linkText: string): string | null {
  const regex = /\<(https:[^\>]*)\>; rel="next"/;
  // Matches the rel="next" section of a longer entry, like:
  // <https://api.github.com/gists?page=5>; rel="next", <https://api.github.com/gists?page=1>; rel="first"

  const pair = regex.exec(linkText);

  if (pair) {
    return pair[1]; // Group 1, the URL portion
  }

  return null;
}
