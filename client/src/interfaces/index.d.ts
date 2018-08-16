interface ITimestamps {
  dateCreated: number
  dateLastModified: number
}

interface IEditableSolutionProperties {
  name: string
  description?: string
}

interface ISourceInformation {
  id: string
  origin: 'gist'
}

interface ISolution extends IEditableSolutionProperties, ITimestamps {
  id: string
  source?: ISourceInformation
  host: string
  files: string[]
}

interface IEditableFileProperties {
  name: string
  language: string
  content: string
}

interface IFile extends IEditableFileProperties, ITimestamps {
  id: string
}

interface ISampleMetadata {
  id: string
  name: string
  fileName: string
  description: string
  rawUrl: string
  group: string
  api_set: any
}

interface ISharedGistMetadata extends ITimestamps {
  id: string
  url: string
  title: string
  description: string
  isPublic: boolean
}

interface IMessageBar {
  isVisible: boolean
  text: string
  style: any // MessageBarType from fabric
  link: { text: string; url: string } | null
}

// settings
// Note: this must be kept in sync with the src/SettingsJSONSchema.ts
interface IEditorSettings {
  theme: string
  font: {
    family: string
    size: number
    lineHeight: number
  }
  minimap: boolean
  tabSize: 2 | 4
  prettier: boolean
  folding: boolean
  linter: {
    mode: string
  }
}

interface IHostSpecificSettings {
  officeOnline: {
    openEditorInNewTab: string
  }
}

interface IDefaultActions {
  applySettings: string
  gistImport: string
}

interface ISettings {
  editor: IEditorSettings
  hostSpecific: IHostSpecificSettings
  defaultActions: IDefaultActions
}

interface IGithubGistPayload {
  id: string
}
