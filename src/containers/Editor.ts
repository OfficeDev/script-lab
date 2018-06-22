import { connect } from 'react-redux'

import Editor from '../components/Editor'
import { selectors } from '../reducers'

const mapStateToProps = (state, ownProps) => {
  console.log(ownProps)
  const solutionFileIds = selectors.solutions.get(state, ownProps.params.solutionId).files
  const urlFileId = ownProps.params.fileId
  const activeFileId = solutionFileIds.includes(urlFileId)
    ? urlFileId
    : solutionFileIds[0]

  return {
    files: solutionFileIds.map(fileId => selectors.files.get(state, fileId)),
    activeFile: selectors.files.get(state, activeFileId),
  }
}

export default connect(mapStateToProps)(Editor)
