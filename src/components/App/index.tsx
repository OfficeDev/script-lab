import React, { Component } from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import IDE from '../../containers/IDE'

const App = () => (
  <div>
    <Route exact path="/:solutionId?/:fileId?" component={IDE} />
  </div>
)

export default App
