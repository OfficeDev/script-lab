import { connect } from 'react-redux'

import { Editor } from '../components'

import { getSolutions } from '../stores/solutions'

const mapStateToProps = state => ({
  solutions: getSolutions(state),
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
