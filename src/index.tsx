import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

// redux
import { Provider } from 'react-redux'
import store from './stores'

// fabric
import { fabricTheme } from './theme'
import { loadTheme } from 'office-ui-fabric-react/lib/Styling'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'

loadTheme({ palette: fabricTheme })
initializeIcons()

import App from './containers/App'
import './index.css'

import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement,
)

registerServiceWorker()

// for hot reloading
// if (module.hot) {
//   module.hot.accept('./App', () => {
//     const NextApp = require('./App').default
//     ReactDOM.render(
//       <BrowserRouter>
//         <NextApp />
//       </BrowserRouter>,
//       rootEl,
//     )
//   })
// }
