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
  fileIds: string[],
): { solution: ISolution; files: IFile[] } => {
  const { id, name, description, script, template, style, libraries } = snippet

  const files = [
    createFile('index.ts', script),
    createFile('index.html', template),
    createFile('index.css', style),
  ]

  const solution = {
    id,
    name,
    description,
    files: files.map(file => file.id),
    dateCreated: Date.now(),
    dateLastModified: Date.now(),
  }

  return { solution, files }
}
