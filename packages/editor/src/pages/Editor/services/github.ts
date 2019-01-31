import QueryString from 'query-string';
import { request as generalRequest, IResponseOrError } from './general';
import { githubAppClientId } from 'common/lib/environment';
import { GITHUB_KEY } from 'common/lib/utilities/localStorage';

const baseApiUrl = 'https://api.github.com';

interface IRequest {
  method: string;
  path: string;
  token?: string;
  jsonPayload?: string;
}

export function generateGithubLoginUrl(randomNumberForState: number) {
  return (
    'https://github.com/login/oauth/authorize' +
    '?' +
    QueryString.stringify({
      client_id: githubAppClientId,
      redirect_uri: window.location.origin,
      scope: 'gist',
      state: randomNumberForState.toString(),
    })
  );
}

export const request = async ({
  method,
  path,
  token,
  jsonPayload,
  isArrayResponse,
}: IRequest & { isArrayResponse: boolean }): Promise<IResponseOrError> => {
  try {
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

    return { response: aggregate };
  } catch (error) {
    return { error };
  }
};

// FIXME probably remove
export const loginUsingDialogApi = async (): Promise<{
  token?: string;
  profilePicUrl?: string;
  username?: string;
}> => {
  throw new Error('FIXME!');

  // let iToken: IToken;
  // try {
  //   iToken = await auth.authenticate('GitHub');
  // } catch (err) {
  //   console.error(err);
  //   throw err;
  // }
  // const token = iToken.access_token;

  // return {
  //   token,
  //   ...(await getProfilePicUrlAndUsername(token)),
  // };
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

export const logout = () => {
  localStorage.removeItem(GITHUB_KEY);

  // Also remove the old office-js-helpers key that stored the auth token
  localStorage.removeItem('OAuth2Tokens');
};

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
