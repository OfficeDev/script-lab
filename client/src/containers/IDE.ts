import { connect } from 'react-redux'
import IDE, { IIDE, IIDEActionsFromRedux, IIDEPropsFromRedux } from '../components/IDE'
import selectors from '../store/selectors'
import { push } from 'connected-react-router'

import { getTheme } from '../theme'

const mapStateToProps = (state): Partial<IIDEPropsFromRedux> => ({
  activeSolution: selectors.solutions.getActive(state),
  activeFile: selectors.solutions.getActiveFile(state),
  theme: getTheme(selectors.host.get(state)),
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
