// TODO: @Sophia -- add api request logic here for importing gist
/* import * as jsyaml from 'js-yaml'
import { find } from 'lodash'
import axios from 'axios'
import { IFile } from '../stores/files'

// gets the gist contents and converts to IFile format
export async function readRawGist(url: string) {
  const response = await axios.get<string>(url)
  const json: { script: { content: string } } = jsyaml.safeLoad(response.data)
  const dummydata: IFile = {
    id: 123,
    name: 'index.ts',
    language: 'typescript',
    dateCreated: 2121,
    dateLastModified: 2121,
    content: json.script.content,
  }
  return dummydata
}

// retrieves gistId
export function getGistId(gistUrl: string) {
  console.log(gistUrl)
  console.log(gistUrl.substr(-32))
  return gistUrl.substr(-32)
}

// retrieves data with GitHub Gist API and reads the JSON to extract and update the raw URL state
export async function getRawYamlUrl(gistId: string): Promise<string> {
  let response
  try {
    response = await axios.get('https://api.github.com/gists/' + getGistId(gistId))
  } catch (e) {
    throw new Error('Could not find file, URL is incorrect')
  }

  const yamlFile = find(response.data.files, fileEntry => {
    console.log(fileEntry)
    return fileEntry.filename.indexOf('.yaml') > 0
  })

  if (!yamlFile) {
    // TODO throw exception
    throw new Error('Could not find file, not a .yaml file')
  }

  return yamlFile.raw_url
} */
