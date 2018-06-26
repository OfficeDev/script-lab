import YAML from 'yamljs'

const fetchYaml = (url: string): {} => {
  return fetch(url)
    .then(resp => resp.text())
    .then(value => YAML.parse(value))
}

export const getSampleMetadata = (platform: string = 'excel') => {
  return fetchYaml(
    `https://raw.githubusercontent.com/OfficeDev/office-js-snippets/master/playlists/${platform}.yaml`,
  )
}

export const getSample = (rawUrl: string) => {
  let url = rawUrl
  url = url.replace('<ACCOUNT>', 'OfficeDev')
  url = url.replace('<REPO>', 'office-js-snippets')
  url = url.replace('<BRANCH>', 'master')

  return fetchYaml(url)
}
