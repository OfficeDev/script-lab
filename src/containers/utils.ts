export const getActiveSnippet = state =>
  state.snippets.items[state.snippets.activeSnippetId]

export const getActiveFile = state => {
  const snippet = getActiveSnippet(state)
  return snippet
    ? snippet.files.find(file => file.name === state.snippets.activeFileName)
    : null
}
