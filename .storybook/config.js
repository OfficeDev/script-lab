import { configure, addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { ThemeProvider } from 'styled-components'
import React from 'react'

import '../src/index.css'
import { StyledComponentsThemeProvider, fabricTheme } from '../src/theme'
import { loadTheme } from 'office-ui-fabric-react/lib/Styling'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'

loadTheme({ palette: fabricTheme })
initializeIcons()

const scThemeProvider = storyFn => (
  <StyledComponentsThemeProvider>{storyFn()}</StyledComponentsThemeProvider>
)

addDecorator(scThemeProvider)
addDecorator(withKnobs)

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /.stories.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

document.getElementsByTagName('body')[0].classList.add('ms-Fabric')

configure(loadStories, module)
