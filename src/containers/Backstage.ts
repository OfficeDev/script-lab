// import { connect } from 'react-redux'

// import { Backstage } from '../components'

// import { createNewSolution, getSolutions } from '../stores/solutions'
// import { importGist } from '../stores/github'
// import { openSolution, getActiveSolution } from '../stores/selection'

// const mapStateToProps = state => ({
//   solutions: getSolutions(state),
//   activeSolution: getActiveSolution(state),
// })

// const mapDispatchToProps = dispatch => ({
//   createNewSolution: () => dispatch(createNewSolution()),
//   openSolution: (solutionId: string) => dispatch(openSolution(solutionId)),
//   importGist: () => dispatch(importGist()),
// })

// export default connect(mapStateToProps, mapDispatchToProps)(Backstage)
import { connect } from 'react-redux'
import Backstage, { IBackstage } from '../components/Backstage'
import { selectors } from '../reducers'
import { solutions } from '../actions'
import { push } from 'connected-react-router'

const mapStateToProps = (state, ownProps): Partial<IBackstage> => ({
  solutions: selectors.solutions.getAll(state),
  activeSolution: selectors.solutions.get(state, ownProps.params.solutionId),
})

const mapDispatchToProps = (dispatch): Partial<IBackstage> => ({
  createNewSolution: () => dispatch(solutions.create()),
  openSolution: (solutionId: string) => dispatch(push(`/edit/${solutionId}/`)),
  importGist: (gistUrl: string) => {
    console.log('importing gist url')
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Backstage)
