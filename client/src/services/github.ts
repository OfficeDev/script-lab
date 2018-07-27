import YAML from 'yamljs'
import { Authenticator, IToken } from '@microsoft/office-js-helpers'

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

export const login = async () => {
  const auth = new Authenticator()
  console.log('trying to login')

  auth.endpoints.add('GitHub', {
    clientId: '210a167954d9ef04b501',
    baseUrl: 'https://github.com/login',
    authorizeUrl: '/oauth/authorize',
    scope: 'gist',
    state: true,
    tokenUrl: 'http://localhost:5000/auth',
  })

  const token = await auth.authenticate('GitHub')
  const profilePic = await getProfilePic(token.access_token!)

  return { token: token.access_token, profilePic }
}

const getProfilePic = async (token: string) => {
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${token}`)
  const request = new Request('https://api.github.com/user', { method: 'GET', headers })
  const response = await fetch(request)
  const json = await response.json()

  return json.avatar_url
}
