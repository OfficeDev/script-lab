import './polyfills'
import React from 'react'
import ReactDOM from 'react-dom'
import { setupFabricTheme } from './theme'
import registerServiceWorker from './registerServiceWorker'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'

import './index.css'
import App from './components/App'

Office.onReady(async () => {
  initializeIcons()

  setupFabricTheme('EXCEL')

  ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)

  registerServiceWorker()
})
