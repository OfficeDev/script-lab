import React from 'react'
import { storiesOf } from '@storybook/react'

import { Footer } from './'
import { getHeaderFabricTheme } from '../../../theme'

const voidFunc = () => {}

const defaultProps = {
  changeHost: voidFunc,
  onSettingsIconClick: voidFunc,
  navigateToCustomFunctionsDashboard: voidFunc,
  currentHost: 'EXCEL',
  hasCustomFunctions: false,
  isWeb: false,
  language: 'typescript',
  headerFabricTheme: getHeaderFabricTheme('EXCEL'),
  currentEditorTheme: 'Dark',
  cycleEditorTheme: voidFunc,
}

storiesOf('IDE|Footer', module)
  .add('basic', () => <Footer {...defaultProps} />)
  .add('isWeb', () => <Footer {...{ ...defaultProps, isWeb: true }} />)
  .add('with Custom Function Solutions', () => (
    <Footer {...{ ...defaultProps, hasCustomFunctions: true }} />
  ))
