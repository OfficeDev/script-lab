import { connect } from 'react-redux'
import { Header } from '../components'

import { getActiveSnippet } from './utils'
import { ISnippetMetadata } from '../interfaces'

const mapStateToProps = state => ({ snippet: getActiveSnippet(state) })

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
