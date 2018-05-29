export interface ISnippet {
  id: string
  metadata: ISnippetMetadata
  fields: { [fieldName: string]: ISnippetField }
}

export interface ISnippetMetadata {
  name: string
  description?: string
  dateCreated: number
}

export interface ISnippetField {
  name: string
  value: string
  meta: ISnippetFieldMetadata
}

export interface ISnippetFieldMetadata {
  type?: SnippetFieldTypes
  lastModified?: number
  language: SupportedLanguages
}

export enum SnippetFieldTypes {
  HTML = 'HTML',
  Script = 'Script',
  CSS = 'CSS',
  Libraries = 'Libraries',
}

export enum SupportedLanguages {
  TypeScript = 'TypeScript',
  JavaScript = 'JavaScript',
  HTML = 'HTML',
  CSS = 'CSS',
}
