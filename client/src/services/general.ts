import YAML from 'yamljs'

export const expandShortenedUrl = (longUrl: string): Promise<string> =>
  fetch(longUrl, { method: 'HEAD', redirect: 'follow' }).then(response => response.url)

export const fetchYaml = (url: string) => {
  return fetch(url)
    .then(resp => {
      if (resp.ok) {
        return Promise.resolve(resp)
      } else {
        return Promise.reject(resp.statusText)
      }
    })
    .then(resp => resp.text())
    .then(value => YAML.parse(value))
}
