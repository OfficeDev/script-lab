import { connect } from 'react-redux'

import App from '../App'

import {
  getActiveSolutionsFiles,
  getActiveFile,
  changeActiveFile,
} from '../stores/selection'

import { IFile, editFile } from '../stores/files'

const mapStateToProps = state => ({
  activeFile: getActiveFile(state),
})

export default connect(mapStateToProps)(App)
