import YAML from 'yamljs'

export interface IResponseOrError {
  response?: any
  error?: Error
}

export interface IRequest {
  method: string
  url: string
  token?: string
  jsonPayload?: string
}
const addIf = (condition, payload) => (condition ? payload : {})

export const fetchYaml = (url: string): Promise<{ content?: object; error?: Error }> =>
  fetch(url)
    .then(resp => {
      if (!resp.ok) {
        return Promise.reject(resp.statusText)
      }
      return resp.text()
    })
    .then(value => ({ content: YAML.parse(value) }))
    .catch(error => ({ error }))

export const request = ({
  method,
  url,
  token,
  jsonPayload,
}: IRequest): Promise<IResponseOrError> => {
  const headers = {
    ...addIf(token, { Authorization: `Bearer ${token}` }),
    ...addIf(method !== 'GET', {
      'Content-Type': 'application/json; charset=utf-8',
    }),
  }

  return fetch(url, {
    method,
    headers,
    body: jsonPayload,
  })
    .then(response => response.json())
    .then(response => ({ response }))
    .catch(error => ({ error }))
}
