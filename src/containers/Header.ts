import { connect } from 'react-redux'
import Header from '../components/Header'

import { getActiveSolution } from '../stores/selection'

const mapStateToProps = state => ({ solution: getActiveSolution(state) })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
