import React from 'react'
import { storiesOf } from '@storybook/react'

import { Header } from './'
import { getHeaderFabricTheme } from '../../theme'
import { getBoilerplate, getBoilerplateSolution } from '../../newSolutionData'

const voidFunc = () => {}

const defaultHeaderProps = {
  isRunnableOnThisHost: true,
  isSettingsView: false,
  isCustomFunctionsView: false,
  isLoggedIn: false,
  headerFabricTheme: getHeaderFabricTheme('EXCEL'),

  login: voidFunc,
  logout: voidFunc,

  showBackstage: voidFunc,
  closeSettings: voidFunc,

  editSolution: (
    solutionId: string,
    solution: Partial<IEditableSolutionProperties>,
  ) => {},
  deleteSolution: voidFunc,

  createPublicGist: voidFunc,
  createSecretGist: voidFunc,
  updateGist: voidFunc,
  notifyClipboardCopySuccess: voidFunc,
  notifyClipboardCopyFailure: voidFunc,

  navigateToCustomFunctions: voidFunc,

  solution: getBoilerplate('EXCEL'),
}

storiesOf('IDE/Header', module).add('basic', () => <Header {...defaultHeaderProps} />)
