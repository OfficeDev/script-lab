import { connect } from 'react-redux'
import { solutions, github, gists } from '../actions'
import { selectors } from '../reducers'
import Header, {
  IHeader,
  IHeaderPropsFromRedux,
  IHeaderActionsFromRedux,
} from '../components/Header'
import { SETTINGS_SOLUTION_ID } from '../constants'
import { getHeaderFabricTheme, getTheme } from '../theme'

const mapStateToProps = (state, ownProps: IHeader): IHeaderPropsFromRedux => ({
  isSettingsView: ownProps.solution.id === SETTINGS_SOLUTION_ID,
  isLoggedIn: !!selectors.github.getToken(state),
  profilePicUrl: selectors.github.getProfilePic(state),
  headerFabricTheme: getHeaderFabricTheme(selectors.config.getHost(state)),
})

const mapDispatchToProps = (dispatch, ownProps: IHeader): IHeaderActionsFromRedux => ({
  login: () => dispatch(github.login.request()),
  logout: () => dispatch(github.logout()),

  editSolution: (solutionId: string, solution: Partial<IEditableSolutionProperties>) =>
    dispatch(solutions.edit(solutionId, solution)),
  deleteSolution: () => dispatch(solutions.remove(ownProps.solution)),

  createPublicGist: () =>
    dispatch(gists.create.request({ solutionId: ownProps.solution.id, isPublic: true })),
  createSecretGist: () =>
    dispatch(gists.create.request({ solutionId: ownProps.solution.id, isPublic: false })),
  updateGist: () => dispatch(gists.update.request({ solutionId: ownProps.solution.id })),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header)
