import { connect } from 'react-redux'
import { withTheme } from 'styled-components'
import { files } from '../actions'
import Editor, { IEditor } from '../components/Editor'
import { selectors } from '../reducers'
import { push } from 'connected-react-router'
import { SETTINGS_SOLUTION_ID, SETTINGS_FILE_ID } from '../constants'

const mapStateToProps = (state, ownProps: IEditor): Partial<IEditor> => ({
  settingsFile: selectors.files.get(state, SETTINGS_FILE_ID),
  isSettingsView: ownProps.activeSolution.id === SETTINGS_SOLUTION_ID,

  editorSettings: {
    monacoTheme: selectors.settings.getMonacoTheme(state),
    fontFamily: selectors.settings.getFontFamily(state),
    fontSize: selectors.settings.getFontSize(state),
    lineHeight: selectors.settings.getLineHeight(state),
    isMinimapEnabled: selectors.settings.getIsMinimapEnabled(state),
    isFoldingEnabled: selectors.settings.getIsFoldingEnabled(state),
    isPrettierEnabled: selectors.settings.getIsPrettierEnabled(state),
  },
})

const mapDispatchToProps = (dispatch, ownProps: IEditor) => ({
  changeActiveFile: (fileId: string) =>
    dispatch(push(`/${ownProps.activeSolution.id}/${fileId}`)),
  editFile: (
    solutionId: string,
    fileId: string,
    file: Partial<IEditableFileProperties>,
  ) => dispatch(files.edit(solutionId, fileId, file)),
  openSettings: () => dispatch(push(`/${SETTINGS_SOLUTION_ID}/${SETTINGS_FILE_ID}`)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(Editor))
