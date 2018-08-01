import YAML from 'yamljs'
import { Authenticator, IToken } from '@microsoft/office-js-helpers'
import GitHub from 'github-api'
import { convertSolutionToSnippet } from '../utils'

// TODO: error handling
const fetchYaml = (url: string) => {
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

export const importGist = (gistId: string) => {
  return fetch(`https://api.github.com/gists/${gistId}`)
    .then(resp => resp.json())
    .then(value => {
      const files = value.files
      return YAML.parse(files[Object.keys(files)[0]].content)
    })
}

export const getAllGistMetadata = async (token: string): Promise<ISharedGistMetadata> => {
  const gh = new GitHub({ token })
  const gists = await gh.getUser().listGists()

  return gists.data.map(gist => {
    const { files, id, description, updated_at, created_at } = gist
    const file = files[Object.keys(files)[0]]
    const title = file.filename.split('.')[0]
    const url = file.raw_url

    return {
      url,
      id,
      description,
      title,
      dateCreated: created_at,
      dateLastModified: updated_at,
    }
  })
}

export const getGist = (rawUrl: string) =>
  fetch(rawUrl)
    .then(resp => resp.text())
    .then(text => YAML.parse(text))

export const createGist = async (
  token: string,
  solution: ISolution,
  files: IFile[],
  isPublic: boolean,
) => {
  const snippetJSON = convertSolutionToSnippet(solution, files)
  const snippet = YAML.stringify(snippetJSON)

  const gh = new GitHub({ token })
  const gist = gh.getGist()

  const data = {
    public: isPublic,
    description: `${solution.description} - Shared with Script Lab`,
    files: {
      [`${solution.name}.yaml`]: {
        content: snippet,
      },
    },
  }

  const response = await gist.create(data)

  return response.data
}

export const updateGist = async (token: string, solution: ISolution, files: IFile[]) => {
  // TODO: updateGist and createGist could probably be refactored to share more code
  const { source } = solution
  const snippetJSON = convertSolutionToSnippet(solution, files)
  const snippet = YAML.stringify(snippetJSON)

  const gh = new GitHub({ token })
  const gist = gh.gitGist(source!.id)

  const data = {
    description: `${solution.description} - Shared with Script Lab`,
    files: {
      [`${solution.name}.yaml`]: {
        content: snippet,
      },
    },
  }

  const response = await gist.update(data)

  return response.data
}

export const login = async () => {
  const auth = new Authenticator()
  console.log('trying to login')

  auth.endpoints.add('GitHub', {
    clientId: '210a167954d9ef04b501', // TODO: un-hardcode clientId
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
