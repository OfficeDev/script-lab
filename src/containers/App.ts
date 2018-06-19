import { connect } from 'react-redux'

import App from '../App'

import {
  getActiveSolutionsFiles,
  getActiveFile,
  changeActiveFile,
} from '../stores/selection'

import { IFile, editFile } from '../stores/files'
import { getIsBackstageVisible, showBackstage, hideBackstage } from '../stores/ui'

const mapStateToProps = state => ({
  activeFile: getActiveFile(state),
  isBackstageVisible: getIsBackstageVisible(state),
})

const mapDispatchToProps = dispatch => ({
  showBackstage: () => dispatch(showBackstage()),
  hideBackstage: () => dispatch(hideBackstage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
