import { connect } from 'react-redux'
import { files } from '../actions'
import Editor from '../components/Editor'
import { selectors } from '../reducers'
import { push } from 'connected-react-router'

const mapStateToProps = (state, ownProps) => ({
  monacoTheme: selectors.settings.getMonacoTheme(state),
  backgroundColor: selectors.settings.getBackgroundColor(state),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeActiveFile: (fileId: string) =>
    dispatch(push(`/${ownProps.activeSolution.id}/${fileId}`)),
  editFile: (
    solutionId: string,
    fileId: string,
    file: Partial<IEditableFileProperties>,
  ) => dispatch(files.edit(solutionId, fileId, file)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
