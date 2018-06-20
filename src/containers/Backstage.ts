import { connect } from 'react-redux'

import { Backstage } from '../components'

import { createNewSolution, getSolutions } from '../stores/solutions'
import { importGist } from '../stores/github'
import { openSolution, getActiveSolution } from '../stores/selection'

const mapStateToProps = state => ({
  solutions: getSolutions(state),
  activeSolution: getActiveSolution(state),
})

const mapDispatchToProps = dispatch => ({
  createNewSolution: () => dispatch(createNewSolution()),
  openSolution: (solutionId: string) => dispatch(openSolution(solutionId)),
  importGist: () => dispatch(importGist()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Backstage)
