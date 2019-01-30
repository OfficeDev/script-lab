import express from 'express';
import request from 'request';
import NodeRSA from 'node-rsa';

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URL } = process.env;
const GENERIC_ERROR_STRING = 'An unexpected login error has occurred.';

export interface IGithubAccessTokenResponse {
  access_token: string;
  error: string;
  error_description: string;
}

export interface IGithubProfileResponse {
  login: string;
  avatar_url: string;
}

export function respondWithAccessTokenCommon({
  code,
  state,
  response,
  onSuccessResponseMassager,
}: {
  code: string;
  state: string;
  response: express.Response;
  onSuccessResponseMassager?: (
    body: IGithubAccessTokenResponse,
  ) => { [key: string]: any };
}) {
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
      let resultObject = getResultObjectBasedOnAuthResponse(error, body);

      console.log('FIXME token = ' + body.access_token);

      // If no access token, just send the error response as is.
      // FIXME if (!body.access_token) {
      response
        .contentType('application/json')
        .status(200)
        .send(resultObject);

      // }
      // FIXME, why am I getting `{"message":"Not Found","documentation_url":"https://developer.github.com/v3"}`?
      //   // Otherwise fetch some profile info for the user
      //   const profileFetchRequest: request.Options = {
      //     url: 'https://api.github.com/user',
      //     headers: {
      //       Authorization: `Bearer ${body.access_token}`,
      //       'User-Agent': 'https://github.com/officedev/script-lab',
      //     },
      //   };
      //   console.log('FIXME', profileFetchRequest);

      //   request.post(
      //     profileFetchRequest,
      //     (_error2, _httpResponse2, body2: IGithubProfileResponse) => {
      //       if (_httpResponse2.statusCode === 200) {
      //         resultObject['username'] = body2.login;
      //         resultObject['profilePicUrl'] = body2.avatar_url;
      //       } else {
      //         console.log('FIXME error', _error2);
      //         console.log(body2);
      //         resultObject = { error: GENERIC_ERROR_STRING };
      //       }

      //       response
      //         .contentType('application/json')
      //         .status(200)
      //         .send(resultObject);
      //     },
      //   );
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
      return onSuccessResponseMassager ? onSuccessResponseMassager(body) : body;
    } else {
      return { error: GENERIC_ERROR_STRING };
    }
  }
}

export function encodeToken(accessToken: string, base64key: string): string {
  const publicKey = Buffer.from(base64key, 'base64');
  return new NodeRSA(publicKey).encrypt(accessToken).toString('base64');
}
