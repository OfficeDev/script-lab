// Note: this must be kept in sync with the src/SettingsJSONSchema.ts
interface IEditorSettings {
  'editor.theme': string
  'editor.fontFamily': string
  'editor.fontSize': number
  'editor.minimap': boolean
  'editor.tabSize': 2 | 4
  'editor.prettier': boolean
  'editor.prettier.autoFormat': boolean
  'editor.folding': boolean
  'editor.wordWrap': 'on' | 'off' | 'bounded'
}

interface ISettings extends IEditorSettings {}
