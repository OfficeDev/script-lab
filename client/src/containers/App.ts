import { connect } from 'react-redux'
import App from '../components/App'
import { selectors } from '../reducers'

import { getTheme } from '../theme'

const mapStateToProps = state => ({
  theme: getTheme(selectors.config.getHost(state)),
})

export default connect(mapStateToProps)(App)
