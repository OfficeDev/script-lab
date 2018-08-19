import './polyfills'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Authenticator } from '@microsoft/office-js-helpers'
import configureStore from './store/configureStore'
import { setupFabricTheme } from './theme'
import registerServiceWorker from './registerServiceWorker'
import { misc } from './store/actions'
import selectors from './store/selectors'

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

  const { store, history } = configureStore()

  setupFabricTheme(selectors.host.get(store.getState()))

  // initial actions
  store.dispatch(misc.initialize())

  ReactDOM.render(<Root store={store} history={history} />, document.getElementById(
    'root',
  ) as HTMLElement)

  registerServiceWorker()
})
