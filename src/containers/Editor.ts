import { connect } from 'react-redux'
import { updateSnippetField } from '../actions'

import { Editor } from '../components'
import { getActiveSnippet } from './utils'

const mapStateToProps = state => ({
  snippet: getActiveSnippet(state),
})

const mapDispatchToProps = dispatch => ({
  updateSnippet: (snippetId: string, fieldName: string, value: string) =>
    dispatch(updateSnippetField(snippetId, fieldName, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
