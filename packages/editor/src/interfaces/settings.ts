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

interface IDeveloperSettings {
  environment: string
}

interface ISettings {
  editor: IEditorSettings
  hostSpecific: IHostSpecificSettings
  defaultActions: IDefaultActions
  developer: IDeveloperSettings
}
