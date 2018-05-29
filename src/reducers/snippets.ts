import { UPDATE_SNIPPET } from '../actions/types'

const initialState = {
  snippets: {},
  activeSnippetId: '123',
  activeFieldName: 'Script',
}

const snippets = (state = initialState, action) => {
  const newState = Object.assign({}, state)
  switch (action.type) {
    case UPDATE_SNIPPET:
      const snippet = state.snippets[action.snippetId]
      snippet[action.fieldName] = action.value

      newState.snippets[action.snippetId] = snippet

      return newState

    default:
      return state
  }
}

export default snippets
