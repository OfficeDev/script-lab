import { connect } from 'react-redux'
import App from '../components/App'
import selectors from '../store/selectors'

import { getTheme } from '../theme'

const mapStateToProps = state => ({
  theme: getTheme(selectors.host.get(state)),
})

export default connect(mapStateToProps)(App)
