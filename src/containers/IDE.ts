import { connect } from 'react-redux'
import IDE from '../components/IDE'
import { selectors } from '../reducers'
import { push } from 'connected-react-router'

const mapStateToProps = (state, ownProps) => {
  let { solutionId } = ownProps.match.params
  const allSolutions = selectors.solutions.getAll(state)
  let solution: ISolution
  if (!solutionId || !allSolutions.map(sol => sol.id).includes(solutionId)) {
    solution = allSolutions.sort((a, b) => {
      if (a.dateLastModified < b.dateLastModified) {
        return 1
      } else if (a.dateLastModified > b.dateLastModified) {
        return -1
      } else {
        return 0
      }
    })[0]

    solutionId = solution.id
  } else {
    solution = selectors.solutions.get(state, solutionId)
  }
  const solutionFileIds = solution.files
  const urlFileId = ownProps.match.params.fileId
  const activeFileId = solutionFileIds.includes(urlFileId)
    ? urlFileId
    : solutionFileIds[0]

  return {
    activeSolution: solution,
    solutions: allSolutions,
    files: solutionFileIds.map(fileId => selectors.files.get(state, fileId)),
    activeFile: selectors.files.get(state, activeFileId),
  }
}

const mapDispatchToProps = dispatch => ({
  openSolution: (solutionId: string) => dispatch(push(`/${solutionId}`)),
  openFile: (solutionId: string, fileId: string) =>
    dispatch(push(`/${solutionId}/${fileId}`)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IDE)
