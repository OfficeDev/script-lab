import React, { Component } from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import IDE from '../IDE'

const App = () => (
  <div>
    <Route exact path="/edit/:solutionId/:fileId?" component={IDE} />
  </div>
)

export default App
