import { configure, addDecorator } from '@storybook/react'
import { configureActions } from '@storybook/addon-actions'

import { withKnobs } from '@storybook/addon-knobs'
import { ThemeProvider } from 'styled-components'
import React from 'react'

import '../src/index.css'
import { getTheme, setupFabricTheme } from '../src/theme'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'

configureActions({
  depth: 100,
  limit: 20,
})

setupFabricTheme('EXCEL')
initializeIcons()

const scThemeProvider = storyFn => (
  <ThemeProvider theme={getTheme('EXCEL')}>{storyFn()}</ThemeProvider>
)

addDecorator(scThemeProvider)
addDecorator(withKnobs)

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /.stories.tsx$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

document.getElementsByTagName('body')[0].classList.add('ms-Fabric')

configure(loadStories, module)
