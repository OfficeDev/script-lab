import './polyfills'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Authenticator } from '@microsoft/office-js-helpers'
import configureStore from './configureStore'
import { setupFabricTheme } from './theme'
import registerServiceWorker from './registerServiceWorker'
import { samples, gists } from './actions'

import './index.css'
import Root from './components/Root'

document.addEventListener(
  'keydown',
  e => {
    if (
      e.keyCode === 83 /*s key*/ &&
      (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
    ) {
      e.preventDefault()
    }
  },
  false,
)

Office.onReady(async () => {
  if (Authenticator.isAuthDialog()) {
    return
  }

  setupFabricTheme()

  const { store, history } = configureStore()

  // initial actions
  store.dispatch(samples.fetchMetadata.request())
  store.dispatch(gists.fetchMetadata.request())

  ReactDOM.render(<Root store={store} history={history} />, document.getElementById(
    'root',
  ) as HTMLElement)

  registerServiceWorker()
})
