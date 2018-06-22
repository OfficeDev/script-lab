import React from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import IDE from '../IDE'

const App = () => (
  <main>
    <Route exact path="/edit/:solutionId/:fileId?" component={IDE} />
  </main>
)

export default App
