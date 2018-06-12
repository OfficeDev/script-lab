import { connect } from 'react-redux'

import { Editor } from '../components'

import {
  getActiveSolutionsFiles,
  getActiveFile,
  changeActiveFile,
} from '../stores/selection'

import { IFile, editFile } from '../stores/files'

const mapStateToProps = state => ({
  files: getActiveSolutionsFiles(state),
  activeFile: getActiveFile(state),
})

const mapDispatchToProps = dispatch => ({
  changeActiveFile: (fileId: string) => dispatch(changeActiveFile(fileId)),
  editFile: (file: IFile) => dispatch(editFile(file)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
