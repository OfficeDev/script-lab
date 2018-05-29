import {
  UPDATE_SNIPPET_METADATA,
  UPDATE_SNIPPET_FIELD,
  CHANGE_ACTIVE_FIELD,
} from '../actions/types'
import { ISnippet, SnippetFieldTypes, SupportedLanguages } from '../interfaces'

const MockSnippet = {
  id: '123',
  metadata: { name: 'Snippet #1', dateCreated: 123 },
  fields: {
    Script: {
      name: 'Script',
      value: '// This is my value',
      meta: {
        type: SnippetFieldTypes.Script,
        language: SupportedLanguages.TypeScript,
      },
    },
    HTML: {
      name: 'HTML',
      value: '<div></div>',
      meta: {
        type: SnippetFieldTypes.HTML,
        language: SupportedLanguages.HTML,
      },
    },
    CSS: {
      name: 'CSS',
      value: '.some-class{\n\tbackground: blue;\n}\n',
      meta: {
        type: SnippetFieldTypes.CSS,
        language: SupportedLanguages.CSS,
      },
    },
  },
}

interface IState {
  items: { [snippetId: string]: ISnippet }
  activeSnippetId: string
  activeFieldName: string
}

const initialState: IState = {
  items: { '123': MockSnippet },
  activeSnippetId: '123',
  activeFieldName: 'Script',
}

const snippets = (state: IState = initialState, action) => {
  const newState = Object.assign({}, state)
  switch (action.type) {
    case UPDATE_SNIPPET_FIELD:
      console.log(action)
      const snippet = state.items[action.snippetId]
      if (snippet) {
        snippet.fields[action.fieldName] = action.value
        newState.items[action.snippetId] = snippet
      } else {
        console.error("Tried to update a snippet that doesn't exist")
      }
      return newState

    case UPDATE_SNIPPET_METADATA:
      newState.items[action.snippetId].metadata = {
        ...newState.items[action.snippetId].metadata,
        ...action.metadata,
      }
      return newState
    case CHANGE_ACTIVE_FIELD:
      newState.activeFieldName = action.fieldName
      return newState

    default:
      return state
  }
}

export default snippets
