import { Authenticator, IToken } from '@microsoft/office-js-helpers'
import { request as generalRequest, IResponseOrError } from './general'
import { authServerUrl, githubAppClientId } from '../environment'

const baseApiUrl = 'https://api.github.com'

interface IRequest {
  method: string
  path: string
  token?: string
  jsonPayload?: string
}

const auth = new Authenticator()

auth.endpoints.add('GitHub', {
  clientId: githubAppClientId,
  baseUrl: 'https://github.com/login',
  authorizeUrl: '/oauth/authorize',
  scope: 'gist',
  state: true,
  tokenUrl: `${authServerUrl}/auth`,
})

export const request = ({
  method,
  path,
  token,
  jsonPayload,
}: IRequest): Promise<IResponseOrError> =>
  generalRequest({ url: `${baseApiUrl}/${path}`, method, token, jsonPayload })

export const login = async (): Promise<{ token?: string; profilePicUrl?: string }> => {
  const token: IToken = await auth.authenticate('GitHub')
  const { response, error } = await request({
    method: 'GET',
    path: 'user',
    token: token.access_token,
  })

  return { token: token.access_token, profilePicUrl: response!.avatar_url }
}

export const logout = (token: string) => auth.tokens.clear()
