import { connect } from 'react-redux'
import { updateSnippet, changeActiveField } from '../actions'

import { Editor } from '../components'

const getActiveSnippet = state =>
  state.snippets.items[state.snippets.activeSnippetId]

const getActiveField = state => {
  const snippet = getActiveSnippet(state)
  return snippet ? snippet.fields[state.snippets.activeFieldName] : null
}

const getEditorValue = state => {
  const activeField = getActiveField(state)
  return activeField ? activeField.value : ''
}

const mapStateToProps = state => ({
  snippet: getActiveSnippet(state),
  activeField: getActiveField(state),
  editorValue: getEditorValue(state),
})

const mapDispatchToProps = dispatch => ({
  updateSnippet: (snippetId: string, fieldName: string, value: string) =>
    dispatch(updateSnippet(snippetId, fieldName, value)),
  changeActiveField: (fieldName: string) =>
    dispatch(changeActiveField(fieldName)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
