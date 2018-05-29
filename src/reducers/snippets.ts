import { UPDATE_SNIPPET } from '../actions/types'
import { ISnippet, SnippetFieldTypes } from '../interfaces'

const MockSnippet = {
  id: '123',
  name: 'Snippet #1',
  fields: {
    Script: {
      name: 'Script',
      value: '// This is my value',
      meta: {
        type: SnippetFieldTypes.Script,
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
    case UPDATE_SNIPPET:
      console.log(action)
      const snippet = state.items[action.snippetId]
      if (snippet) {
        snippet.fields[action.fieldName] = action.value
        newState.items[action.snippetId] = snippet
      } else {
        console.error("Tried to update a snippet that doesn't exist")
      }
      return newState

    default:
      return state
  }
}

export default snippets
