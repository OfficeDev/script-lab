import { UPDATE_SNIPPET_METADATA, CHANGE_ACTIVE_FILE } from '../actions/types'

import { ISnippet, SupportedLanguages } from '../interfaces'

const MockSnippet = {
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

interface IState {
  items: { [snippetId: string]: ISnippet }
  activeSnippetId: string
  activeFileName: string
}

const initialState: IState = {
  items: { '123': MockSnippet },
  activeSnippetId: '123',
  activeFileName: 'Script',
}

const snippets = (state: IState = initialState, action) => {
  const newState = Object.assign({}, state)
  switch (action.type) {
    case UPDATE_SNIPPET_METADATA:
      newState.items[action.snippetId].metadata = {
        ...newState.items[action.snippetId].metadata,
        ...action.metadata,
      }
      return newState

    case CHANGE_ACTIVE_FILE:
      newState.activeFileName = action.fileName
      return newState

    default:
      return state
  }
}

export default snippets
