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

export const request = ({
  method,
  path,
  token,
  jsonPayload,
}: IRequest): Promise<IResponseOrError> =>
  generalRequest({ url: `${baseApiUrl}/${path}`, method, token, jsonPayload });

export const login = async (): Promise<{
  token?: string;
  profilePicUrl?: string;
  username?: string;
}> => {
  let itoken: IToken;
  try {
    itoken = await auth.authenticate('GitHub');
  } catch (err) {
    console.error(err);
    throw err;
  }
  const token = itoken.access_token;

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

export const logout = (token: string) => auth.tokens.clear();
