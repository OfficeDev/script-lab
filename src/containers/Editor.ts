import { connect } from 'react-redux'

import { Editor } from '../components'

import { getActiveSolutionsFiles, getActiveFile } from '../stores/selection'

const mapStateToProps = state => ({
  files: getActiveSolutionsFiles(state),
  activeFile: getActiveFile(state),
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
