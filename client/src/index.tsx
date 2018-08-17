import './polyfills'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Authenticator } from '@microsoft/office-js-helpers'
import configureStore from './configureStore'
import { setupFabricTheme } from './theme'
import registerServiceWorker from './registerServiceWorker'
import { samples, gists } from './actions'
import { selectors } from './reducers'

import './index.css'
import Root from './components/Root'
import { getHost } from './reducers/config'

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

  const { store, history } = configureStore()

  setupFabricTheme(selectors.config.getHost(store.getState()))

  // initial actions
  store.dispatch(samples.fetchMetadata.request())
  store.dispatch(gists.fetchMetadata.request())

  ReactDOM.render(<Root store={store} history={history} />, document.getElementById(
    'root',
  ) as HTMLElement)

  registerServiceWorker()
})
