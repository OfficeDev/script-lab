import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

import './index.css'

import registerServiceWorker from './registerServiceWorker'
const rootEl = document.getElementById('root') as HTMLElement
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootEl,
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
