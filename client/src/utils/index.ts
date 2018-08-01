import uuidv4 from 'uuid'

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

interface IContentLanguagePair {
  content: string
  language: string
}

interface ISnippet {
  id: string
  gist?: string
  gistOwnerId?: string
  name: string
  description?: string
  /** author: export-only */
  author?: string
  host: string
  /** api_set: export-only (+ check at first level of import) */
  api_set?: {
    [index: string]: number
  }
  platform: string
  created_at: number
  modified_at: number
  order?: number

  script: IContentLanguagePair
  template: IContentLanguagePair
  style: IContentLanguagePair
  libraries: string
}

const createFile = (name, { content, language }): IFile => ({
  id: uuidv4(),
  name,
  content,
  language,
  dateCreated: Date.now(),
  dateLastModified: Date.now(),
})

export const convertSnippetToSolution = (
  snippet: ISnippet,
): { solution: ISolution; files: IFile[] } => {
  const { name, description, script, template, style, libraries, host } = snippet

  const files = [
    createFile('index.ts', script),
    createFile('index.html', template),
    createFile('index.css', style),
    createFile('libraries.txt', { content: libraries, language: 'txt' }),
  ]

  const solution = {
    id: uuidv4(),
    name,
    host,
    description,
    files: files.map(file => file.id),
    dateCreated: Date.now(),
    dateLastModified: Date.now(),
  }

  return { solution, files }
}

export const convertSolutionToSnippet = (
  solution: ISolution,
  files: IFile[],
): ISnippet => {
  const { id, name, description, dateCreated, dateLastModified, host } = solution

  const script: IFile = files.find(file => file.name === 'index.ts')!
  const template: IFile = files.find(file => file.name === 'index.html')!
  const style: IFile = files.find(file => file.name === 'index.css')!
  const libraries: IFile = files.find(file => file.name === 'libraries.txt')!

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
