import YAML from 'yamljs'
import { Authenticator, IToken } from '@microsoft/office-js-helpers'
import GitHub from 'github-api'
import { convertSolutionToSnippet } from '../utils'
import { fetchYaml } from './general'

const baseApiUrl = 'https://api.github.com'

export const getSampleMetadata = (platform: string = 'excel') => {
  return fetchYaml(
    `https://raw.githubusercontent.com/OfficeDev/office-js-snippets/master/playlists/${platform}.yaml`,
  )
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

export const getSnippetFromRawUrl = (rawUrl: string): Promise<object> => fetchYaml(rawUrl)

export const getSnippetFromGistId = (gistId: string): Promise<object> =>
  fetch(`${baseApiUrl}/gists/${gistId}`)
    .then(resp => resp.json())
    .then(value => {
      const files = value.files
      return YAML.parse(files[Object.keys(files)[0]].content)
    })

const updateOrCreateGist = (
  token: string,
  solution: ISolution,
  files: IFile[],
  gistId?: string,
  isPublic?: boolean,
): Promise<object | Error> => {
  const snippetJSON = convertSolutionToSnippet(solution, files)
  const snippet = YAML.stringify(snippetJSON)

  const url = gistId ? `${baseApiUrl}/gists/${gistId}` : `${baseApiUrl}/gists`
  const method = gistId ? 'PATCH' : 'POST'

  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      description: `${solution.description}`,
      files: {
        [`${solution.name}.yaml`]: {
          content: snippet,
        },
      },
      ...(gistId ? { public: isPublic } : {}),
    }),
  })
    .then((resp: Response) => {
      if (resp.ok) {
        return Promise.resolve(resp)
      } else {
        return Promise.reject(resp)
      }
    })
    .then((resp: Response) => resp.json())
    .catch(error => Promise.reject(error))
}

export const updateGist = (
  token: string,
  solution: ISolution,
  files: IFile[],
  gistId: string,
): Promise<object | Error> => updateOrCreateGist(token, solution, files, gistId)

export const createGist = (
  token: string,
  solution: ISolution,
  files: IFile[],
): Promise<object | Error> => updateOrCreateGist(token, solution, files)

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
