export interface ISnippet {
  id: string
  metadata: ISnippetMetadata
  files: ISnippetFile[]
}

export interface ISnippetMetadata {
  name: string
  description?: string
  dateCreated: number
}

export interface ISnippetFile {
  name: string
  value: string
  language: SupportedLanguages
  lastModified: number
}

export enum SupportedLanguages {
  TypeScript = 'TypeScript',
  JavaScript = 'JavaScript',
  HTML = 'HTML',
  CSS = 'CSS',
}
