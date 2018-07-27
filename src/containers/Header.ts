import { connect } from 'react-redux'
import { solutions, github } from '../actions'
import Header from '../components/Header'

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = dispatch => ({
  editSolution: (solutionId: string, solution: Partial<IEditableSolutionProperties>) =>
    dispatch(solutions.edit(solutionId, solution)),
  login: () => dispatch(github.login.request()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
