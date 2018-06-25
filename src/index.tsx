import * as React from 'react'
import * as ReactDOM from 'react-dom'
import configureStore from './configureStore'
import { setupFabricTheme } from './theme'
import registerServiceWorker from './registerServiceWorker'

import './index.css'
import Root from './components/Root'

setupFabricTheme()

const { store, history } = configureStore()

ReactDOM.render(<Root store={store} history={history} />, document.getElementById(
  'root',
) as HTMLElement)

registerServiceWorker()
