import { Authenticator, IToken } from '@microsoft/office-js-helpers'
import { request as generalRequest, IResponseOrError } from './general'

const baseApiUrl = 'https://api.github.com'

interface IRequest {
  method: string
  path: string
  token?: string
  jsonPayload?: string
}

export const request = ({
  method,
  path,
  token,
  jsonPayload,
}: IRequest): Promise<IResponseOrError> =>
  generalRequest({ url: `${baseApiUrl}/${path}`, method, token, jsonPayload })

export const login = async (): Promise<{ token?: string; profilePicUrl?: string }> => {
  const auth = new Authenticator()

  auth.endpoints.add('GitHub', {
    clientId: '210a167954d9ef04b501', // TODO: un-hardcode clientId
    baseUrl: 'https://github.com/login',
    authorizeUrl: '/oauth/authorize',
    scope: 'gist',
    state: true,
    tokenUrl: 'http://localhost:5000/auth',
  })

  const token: IToken = await auth.authenticate('GitHub')
  const { response, error } = await request({
    method: 'GET',
    path: 'user',
    token: token.access_token,
  })

  return { token: token.access_token, profilePicUrl: response!.avatar_url }
}
