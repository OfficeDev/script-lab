import { connect } from 'react-redux'
import { Footer } from '../components'

import { getActiveField } from './utils'

const getLanguage = state => {
  const activeField = getActiveField(state)
  return activeField ? activeField.metadata.language : 'plaintext'
}

const mapStateToProps = state => ({
  language: getLanguage(state),
})

export default connect(mapStateToProps)(Footer)
