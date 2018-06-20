import { connect } from 'react-redux'

import { Backstage } from '../components'

import { createNewSolution, getSolutions } from '../stores/solutions'
import { importGist } from '../stores/github'

const mapStateToProps = state => ({
  solutions: getSolutions(state),
})

const mapDispatchToProps = dispatch => ({
  createNewSolution: () => dispatch(createNewSolution()),
  importGist: () => dispatch(importGist()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Backstage)
