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

interface ISolutionWithoutFiles extends IEditableSolutionProperties, ITimestamps {
  id: string
  source?: ISourceInformation
  host: string
}

interface ISolutionWithFileIds extends ISolutionWithoutFiles {
  files: string[]
}

interface ISolution extends ISolutionWithoutFiles {
  files: IFile[]
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
  host: string
  name: string
  fileName: string
  description: string
  rawUrl: string
  group: string
  api_set: any
}

interface ISampleMetadataByGroup {
  [group: string]: ISampleMetadata[]
}

interface ISharedGistMetadata extends ITimestamps {
  id: string
  host: string
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

interface IThemePrimaryColors {
  primaryDarkest: string
  primaryDarker: string
  primaryDark: string
  primary: string
  primaryLight: string
  primaryLighter: string
}

interface IThemeNeutralColors {
  black: string
  neutralDark: string
  neutralPrimary: string
  neutralSecondary: string
  neutralLight: string
  neutralLighter: string
  white: string
}

interface ITheme extends IThemePrimaryColors, IThemeNeutralColors {}

// script-lab
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
