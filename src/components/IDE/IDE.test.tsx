import React from 'react'
import ReactDOM from 'react-dom'
import IDE from './index'

it('renders without crashing', () => {
  const div = document.createElement('div')
  // ReactDOM.render(<IDE />, div)
  ReactDOM.unmountComponentAtNode(div)
})
