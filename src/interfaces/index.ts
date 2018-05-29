export interface ISnippet {
  id: string
  name: string
  fields: { [fieldName: string]: ISnippetField }
}

export interface ISnippetField {
  name: string
  value: string
  meta?: ISnippetMetadata
}

export interface ISnippetMetadata {
  type?: SnippetFieldTypes
  lastModified?: number
}

export enum SnippetFieldTypes {
  HTML = 'HTML',
  Script = 'Script',
  CSS = 'CSS',
  Libraries = 'Libraries',
}
