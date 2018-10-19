// Note: this must be kept in sync with the src/SettingsJSONSchema.ts
interface IEditorSettings {
  theme: string
  font: {
    family: string
    size: number
  }
  minimap: boolean
  tabSize: 2 | 4
  prettier: {
    enabled: boolean
    autoFormat: boolean
  }
  folding: boolean
  wordWrap: 'on' | 'off' | 'bounded'
}

interface ISettings {
  editor: IEditorSettings
  environment: string
}
