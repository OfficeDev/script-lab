import { connect } from 'react-redux'

import { Backstage } from '../components'

import { createNewSolution } from '../stores/solutions'

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  createNewSolution: () => dispatch(createNewSolution()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Backstage)
