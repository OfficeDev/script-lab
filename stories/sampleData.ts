import {
  ISnippet,
  SnippetFieldTypes,
  SupportedLanguages,
} from '../src/interfaces/index'

export const Snippet1 = {
  id: '123',
  metadata: { name: 'Snippet #1', dateCreated: 123 },
  fields: {
    Script: {
      name: 'Script',
      value: '// This is my value',
      metadata: {
        type: SnippetFieldTypes.Script,
        language: SupportedLanguages.TypeScript,
      },
    },
    HTML: {
      name: 'HTML',
      value: '<div></div>',
      metadata: {
        type: SnippetFieldTypes.HTML,
        language: SupportedLanguages.HTML,
      },
    },
    CSS: {
      name: 'CSS',
      value: '.some-class{\n\tbackground: blue;\n}\n',
      metadata: {
        type: SnippetFieldTypes.CSS,
        language: SupportedLanguages.CSS,
      },
    },
  },
}
