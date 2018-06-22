import { connect } from 'react-redux'
import { selectors } from '../reducers'
import Header from '../components/Header'

const mapStateToProps = (state, ownProps) => ({
  solution: selectors.solutions.get(state, ownProps.params.solutionId),
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps)(Header)
