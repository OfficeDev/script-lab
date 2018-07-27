import YAML from 'yamljs'

// TODO: error handling
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

export const getGist = (gistId: string) => {
  return fetch(`https://api.github.com/gists/${gistId}`)
    .then(resp => resp.text())
    .then(value => {
      const { files } = JSON.parse(value)
      const { content } = files[Object.keys(files)[0]]
      return YAML.parse(content)
    })
}

export const login = () => {
  const clientId = '210a167954d9ef04b501'
  window.open(
    `https://github.com/login/oauth/authorize?scope=gists&client_id=${clientId}`,
  )
}
