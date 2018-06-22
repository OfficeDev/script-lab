import { connect } from 'react-redux'
import { selectors } from '../reducers'
import { solutions } from '../actions'
import Footer from '../components/Footer'

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

export default connect(mapStateToProps)(Footer)
