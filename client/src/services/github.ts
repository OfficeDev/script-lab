import { Authenticator, IToken } from '@microsoft/office-js-helpers'

interface IResponseOrError {
  response?: any
  error?: Error
}

interface IRequest {
  method: string
  path: string
  token?: string
  jsonPayload?: string
}

const baseApiUrl = 'https://api.github.com'

const addIf = (condition, payload) => (condition ? payload : {})

export const request = ({
  method,
  path,
  token,
  jsonPayload,
}: IRequest): Promise<IResponseOrError> => {
  const headers = {
    ...addIf(token, { Authorization: `Bearer ${token}` }),
    ...addIf(method !== 'GET', {
      'Content-Type': 'application/json; charset=utf-8',
    }),
  }
  return fetch(`${baseApiUrl}/${path}`, {
    method,
    headers,
    body: jsonPayload,
  })
    .then(response => response.json())
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

export const login = async () => {
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

  return { token: token.access_token, profilePic: response!.avatar_url }
}
