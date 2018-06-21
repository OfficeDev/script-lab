import { connect } from 'react-redux'
import Footer from '../components/Footer'
import { getActiveFileLanguage } from '../stores/selection'

const mapStateToProps = state => ({
  language: getActiveFileLanguage(state),
})

export default connect(mapStateToProps)(Footer)
