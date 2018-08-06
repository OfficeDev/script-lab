import { connect } from 'react-redux'
import { messageBar } from '../actions'
import MessageBar from '../components/MessageBar'

const mapStateToProps = state => ({
  messageBarProps: state.messageBar,
})

const mapDispatchToProps = dispatch => ({
  dismiss: () => dispatch(messageBar.dismiss()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MessageBar)
