import { connect } from 'react-redux'
import IDE, { IIDE, IIDEActionsFromRedux, IIDEPropsFromRedux } from '../components/IDE'
import { selectors } from '../reducers'
import { push } from 'connected-react-router'

import { getTheme } from '../theme'

const mapStateToProps = (state): IIDEPropsFromRedux => ({
  activeSolution: selectors.active.solution(state),
  files: selectors.active.files(state),
  activeFile: selectors.active.file(state),
  theme: getTheme(selectors.config.getHost(state)),
})

const mapDispatchToProps = (dispatch): IIDEActionsFromRedux => ({
  openSolution: (solutionId: string) => dispatch(push(`/${solutionId}`)),
  openFile: (solutionId: string, fileId: string) =>
    dispatch(push(`/${solutionId}/${fileId}`)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IDE)
