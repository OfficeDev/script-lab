import { configure } from '@storybook/react'
import '../src/index.css'
// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

document.getElementsByTagName('body')[0].classList.add('ms-Fabric')

configure(loadStories, module)
