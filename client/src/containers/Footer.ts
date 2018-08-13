import { connect } from 'react-redux'
import { selectors } from '../reducers'
import { solutions } from '../actions'
import Footer from '../components/Footer'
import { push } from 'connected-react-router'
import { SETTINGS_SOLUTION_ID, SETTINGS_FILE_ID } from '../constants'

const getLanguage = (state, fileId: string | undefined): string => {
  if (!fileId) {
    return ''
  }

  const file = selectors.files.get(state, fileId)
  if (!file) {
    return ''
  }

  return file.language
}

const mapStateToProps = (state, ownProps) => ({
  language: getLanguage(state, ownProps.activeFile.id),
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  onSettingsIconClick: () =>
    dispatch(push(`/${SETTINGS_SOLUTION_ID}/${SETTINGS_FILE_ID}`)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Footer)
