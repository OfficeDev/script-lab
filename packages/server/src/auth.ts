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

      console.log('FIXME for debugging for now token = ' + body.access_token);
      console.log("Cumulative thing that we're sending is:");
      console.log(resultObject);

      response
        .contentType('application/json')
        .status(200)
        .send(resultObject);
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
  console.log('FIXME the access token was ' + accessToken);
  const publicKey = Buffer.from(base64key, 'base64');
  const encoded = new NodeRSA(publicKey).encrypt(accessToken).toString('base64');
  console.log('Encoding your token, ' + encoded);
  return encoded;
}
