import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'

import './index.css'

import registerServiceWorker from './registerServiceWorker'
const rootEl = document.getElementById('root') as HTMLElement
ReactDOM.render(<App />, rootEl)

registerServiceWorker()

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    ReactDOM.render(<NextApp />, rootEl)
  })
}
