import YAML from 'js-yaml';

export interface IResponseOrError<T> {
  response?: T;
  error?: Error;
}

export interface IRequest {
  method: string;
  url: string;
  token?: string;
  jsonPayload?: string;
}

export const fetchYaml = (url: string): Promise<{ content?: object; error?: Error }> =>
  fetch(url)
    .then(resp => {
      if (!resp.ok) {
        return Promise.reject(resp.statusText);
      }
      return resp.text();
    })
    .then(value => ({ content: YAML.safeLoad(value) }))
    .catch(error => ({ error }));

export async function request<T>({
  method,
  url,
  token,
  jsonPayload,
}: IRequest): Promise<IResponseOrError<T> & { headers?: Headers }> {
  const headers = {
    ...getPayloadOrEmpty(token, { Authorization: `Bearer ${token}` }),
    ...getPayloadOrEmpty(method !== 'GET', {
      'Content-Type': 'application/json; charset=utf-8',
    }),
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: jsonPayload,
    });
    if (response.ok) {
      return { response: await response.json(), headers: response.headers };
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  } catch (error) {
    return { error };
  }
}

function getPayloadOrEmpty(condition: any, payload: { [key: string]: string }) {
  return condition ? payload : {};
}
