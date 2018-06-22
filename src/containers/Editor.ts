import { connect } from 'react-redux'
import { files } from '../actions'
import Editor from '../components/Editor'
import { selectors } from '../reducers'
import { push } from 'connected-react-router'

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeActiveFile: (fileId: string) =>
    dispatch(push(`/${ownProps.activeSolution.id}/${fileId}`)),
  editFile: (fileId: string, file: Partial<IEditableFileProperties>) =>
    dispatch(files.edit(fileId, file)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
