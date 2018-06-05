import { connect } from 'react-redux'
import { changeActiveFile } from '../actions'

import { Editor } from '../components'
import { getActiveSnippet, getActiveFile } from './utils'

const mapStateToProps = state => ({
  snippet: getActiveSnippet(state),
  activeFile: getActiveFile(state),
})

const mapDispatchToProps = dispatch => ({
  changeActiveFile: (fileName: string) => dispatch(changeActiveFile(fileName)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
