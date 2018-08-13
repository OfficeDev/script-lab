import YAML from 'yamljs'

export const expandShortenedUrl = (longUrl: string): Promise<string> =>
  fetch(longUrl, { method: 'HEAD', redirect: 'follow' }).then(response => response.url)

export const fetchYaml = (url: string) => {
  return fetch(url)
    .then(resp => resp.text())
    .then(value => YAML.parse(value))
}
