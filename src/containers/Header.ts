import { connect } from 'react-redux'
import { Header } from '../components'

import { getActiveSolution } from '../stores/selection'
import { ISnippetMetadata } from '../interfaces'

const mapStateToProps = state => ({ solution: getActiveSolution(state) })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
