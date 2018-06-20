import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

// TODO remove
if (!localStorage.getItem('state')) {
  localStorage.setItem(
    'state',
    '{"files":{"123":{"id":"123","name":"index.ts","language":"typescript","dateLastModified":789,"content":"// hello world"},"456":{"id":"456","name":"index.html","language":"html","dateLastModified":987,"content":"<div>hello world</div>"}},"solutions":{"123456789":{"id":"123456789","name":"Solution Name","author":"AUTHOR_ID","dateCreated":123,"dateLastModified":456,"files":["123","456"]}},"users":{"AUTHOR_ID":{"id":"AUTHOR_ID","name":"Nico Bellante"}}}',
  )
}

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

// Temporary: auto-prefill the state
if (!localStorage.getItem('state')) {
  localStorage.setItem(
    'state',
    '{"files":{"123":{"id":"123","name":"index.ts","language":"typescript","dateLastModified":789,"content":"// hello world"},"456":{"id":"456","name":"index.html","language":"html","dateLastModified":987,"content":"<div>hello world</div>"}},"solutions":{"123456789":{"id":"123456789","name":"Solution Name","author":"AUTHOR_ID","dateCreated":123,"dateLastModified":456,"files":["123","456"]}},"users":{"AUTHOR_ID":{"id":"AUTHOR_ID","name":"Nico Bellante"}}}',
  )
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement,
)

// registerServiceWorker()

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
