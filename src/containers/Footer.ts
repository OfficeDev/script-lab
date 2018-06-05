import { connect } from 'react-redux'
import { Footer } from '../components'

import { getActiveFile } from './utils'

const getLanguage = state => {
  const activeFile = getActiveFile(state)
  return activeFile ? activeFile.language : 'plaintext'
}

const mapStateToProps = state => ({
  language: getLanguage(state),
})

export default connect(mapStateToProps)(Footer)
