import express from 'express';
import request from 'request';

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URL } = process.env;

export interface IGithubAccessTokenResponse {
  access_token: string;
  error: string;
  error_description: string;
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
      response
        .contentType('application/json')
        .status(200)
        .send(getResultObjectBasedOnResponse(error, body));
    },
  );

  // Helper
  function getResultObjectBasedOnResponse(
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
      return { error: 'An unexpected login error has occurred.' };
    }
  }
}

export function encodeToken(accessToken: string, key: string): { encodedToken: string } {
  return { encodedToken: '!FIXME!' + accessToken + '!FIXME!' + key };
}
