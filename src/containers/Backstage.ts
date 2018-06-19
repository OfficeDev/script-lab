import { connect } from 'react-redux'

import { Backstage } from '../components'

import { createNewSolution } from '../stores/solutions'
import { importGist } from '../stores/github'

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  createNewSolution: () => dispatch(createNewSolution()),
  importGist: () => dispatch(importGist()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Backstage)
