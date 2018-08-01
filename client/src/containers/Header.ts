import { connect } from 'react-redux'
import { solutions, github, gists } from '../actions'
import { selectors } from '../reducers'
import Header from '../components/Header'

const mapStateToProps = state => ({
  profilePic: selectors.github.getProfilePic(state),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  editSolution: (solutionId: string, solution: Partial<IEditableSolutionProperties>) =>
    dispatch(solutions.edit(solutionId, solution)),
  login: () => dispatch(github.login.request()),
  deleteSolution: () => dispatch(solutions.remove(ownProps.solution)),
  createPublicGist: () =>
    dispatch(gists.create.request({ solutionId: ownProps.solution.id, isPublic: true })),
  createSecretGist: () =>
    dispatch(gists.create.request({ solutionId: ownProps.solution.id, isPublic: false })),
  updateGist: () => dispatch(gists.update.request({ solutionId: ownProps.solution.id })),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
