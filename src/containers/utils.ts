export const getActiveSnippet = state =>
  state.snippets.items[state.snippets.activeSnippetId]

export const getActiveField = state => {
  const snippet = getActiveSnippet(state)
  return snippet ? snippet.fields[state.snippets.activeFieldName] : null
}
