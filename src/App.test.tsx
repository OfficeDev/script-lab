import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'

// TODO: also figure out what the best practice is here so that it doesn't break every time a new prop is added
const fakeHideBackstage = () => console.log('hiding backstage')
const fakeShowBackstage = () => console.log('showing backstage')

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <App
      activeFile={undefined}
      hideBackstage={fakeHideBackstage}
      showBackstage={fakeShowBackstage}
      isBackstageVisible={false}
    />,
    div,
  )
  ReactDOM.unmountComponentAtNode(div)
})
