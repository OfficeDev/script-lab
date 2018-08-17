import YAML from 'yamljs'

export const expandShortenedUrl = (longUrl: string): Promise<string> =>
  fetch(longUrl, { method: 'HEAD', redirect: 'follow' }).then(response => response.url)

export const fetchYaml = (url: string): Promise<{ content?: object; error?: Error }> => {
  return fetch(url)
    .then(resp => {
      if (resp.ok) {
        return Promise.resolve(resp)
      } else {
        return Promise.reject(resp.statusText)
      }
    })
    .then(resp => resp.text())
    .then(value => ({ content: YAML.parse(value) }))
    .catch(error => ({ error }))
}
