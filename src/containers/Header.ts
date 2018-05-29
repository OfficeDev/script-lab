import { connect } from 'react-redux'
import { Header } from '../components'

import { getActiveSnippet } from './utils'
import { updateSnippetMetadata } from '../actions'
import { ISnippetMetadata } from '../interfaces'

const mapStateToProps = state => ({ snippet: getActiveSnippet(state) })

const mapDispatchToProps = dispatch => ({
  updateSnippetMetadata: (
    snippetId: string,
    metadata: Partial<ISnippetMetadata>,
  ) => dispatch(updateSnippetMetadata(snippetId, metadata)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
