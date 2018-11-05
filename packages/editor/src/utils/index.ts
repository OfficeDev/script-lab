import uuidv4 from 'uuid'
import { LIBRARIES_FILE_NAME } from '../constants'

export const getObjectValues = (dict: object): any[] =>
  Object.keys(dict).map(key => dict[key])

export function setUpMomentJsDurationDefaults(momentInstance: {
  relativeTimeThreshold(threshold: string, limit: number): boolean
}) {
  momentInstance.relativeTimeThreshold('s', 40)
  // Note, per documentation, "ss" must be set after "s"
  momentInstance.relativeTimeThreshold('ss', 1)
  momentInstance.relativeTimeThreshold('m', 40)
  momentInstance.relativeTimeThreshold('h', 20)
  momentInstance.relativeTimeThreshold('d', 25)
  momentInstance.relativeTimeThreshold('M', 10)
}

export function pause(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

const EXT_TO_LANG_MAP = {
  js: 'JavaScript',
  ts: 'TypeScript',
  html: 'HTML',
  css: 'CSS',
}

export function convertExtensionToLanguage(file): string {
  if (!file) {
    return ''
  }

  const extension = file.name.split('.').pop()
  if (extension) {
    return EXT_TO_LANG_MAP[extension.toLowerCase()] || ''
  }
  return ''
}

const createFile = (name, { content, language }): IFile => ({
  id: uuidv4(),
  name,
  content,
  language,
  dateCreated: Date.now(),
  dateLastModified: Date.now(),
})

export const convertSnippetToSolution = (snippet: ISnippet): ISolution => {
  const { name, description, script, template, style, libraries, host } = snippet

  const files = [
    createFile('index.ts', script),
    createFile('index.html', template),
    createFile('index.css', style),
    createFile(LIBRARIES_FILE_NAME, { content: libraries, language: 'libraries' }),
  ]

  const solution = {
    id: uuidv4(),
    name,
    host,
    description,
    options: {},
    files,
    dateCreated: Date.now(),
    dateLastModified: Date.now(),
  }

  return solution
}

export const convertSolutionToSnippet = (solution: ISolution): ISnippet => {
  const { id, name, description, dateCreated, dateLastModified, host, files } = solution

  const script: IFile = files.find(file => file.name === 'index.ts')!
  const template: IFile = files.find(file => file.name === 'index.html')!
  const style: IFile = files.find(file => file.name === 'index.css')!
  const libraries: IFile = files.find(file => file.name === LIBRARIES_FILE_NAME)!

  return {
    id,
    name,
    description,
    created_at: dateCreated,
    modified_at: dateLastModified,
    host,
    platform: host,
    script: {
      content: script.content,
      language: script.language,
    },
    template: {
      content: template.content,
      language: template.language,
    },
    style: {
      content: style.content,
      language: style.language,
    },
    libraries: libraries.content,
  }
}
