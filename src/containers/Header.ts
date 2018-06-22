import { connect } from 'react-redux'
import { selectors } from '../reducers'
import { solutions } from '../actions'
import Header from '../components/Header'

const mapStateToProps = (state, ownProps) => ({
  solution: selectors.solutions.get(state, ownProps.params.solutionId),
})

const mapDispatchToProps = dispatch => ({
  editSolution: (solutionId: string, solution: Partial<IEditableSolutionProperties>) =>
    dispatch(solutions.edit(solutionId, solution)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
