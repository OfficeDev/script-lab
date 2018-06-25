import { connect } from 'react-redux'
import IDE from '../components/IDE'
import { selectors } from '../reducers'
import { push } from 'connected-react-router'

const mapStateToProps = (state, ownProps) => ({
  activeSolution: selectors.active.solution(state),
  solutions: selectors.solutions.getAll(state),
  files: selectors.active.files(state),
  activeFile: selectors.active.file(state),
})

const mapDispatchToProps = dispatch => ({
  openSolution: (solutionId: string) => dispatch(push(`/${solutionId}`)),
  openFile: (solutionId: string, fileId: string) =>
    dispatch(push(`/${solutionId}/${fileId}`)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IDE)
