import { ISnippet, SupportedLanguages } from '../src/interfaces/index'

const Snippet1 = {
  id: '123',
  metadata: { name: 'Snippet #1', dateCreated: 123 },
  files: [
    {
      name: 'Script',
      value: '// This is my value',
      language: SupportedLanguages.TypeScript,
      lastModified: 0,
    },
    {
      name: 'HTML',
      value: '<div></div>',
      language: SupportedLanguages.HTML,
      lastModified: 0,
    },
    {
      name: 'CSS',
      value: '.some-class{\n\tbackground: blue;\n}\n',
      language: SupportedLanguages.CSS,
      lastModified: 0,
    },
  ],
}
