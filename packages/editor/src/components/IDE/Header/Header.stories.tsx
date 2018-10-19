import React from 'react'
import { storiesOf } from '@storybook/react'

import { Header } from './'
import { getCommandBarFabricTheme } from '../../../theme'
import { getBoilerplate, getBoilerplateSolution } from '../../../newSolutionData'

const voidFunc = () => {}

const defaultHeaderProps = {
  isRunnableOnThisHost: true,
  isSettingsView: false,
  isCustomFunctionsView: false,
  isLoggedIn: false,
  isLoggingInOrOut: false,
  profilePicUrl: null,
  screenWidth: 700,
  commandBarFabricTheme: getCommandBarFabricTheme('EXCEL'),

  login: voidFunc,
  logout: voidFunc,

  showBackstage: voidFunc,
  closeSettings: voidFunc,

  editSolution: (solutionId: string, solution: any) => {},
  deleteSolution: voidFunc,

  createPublicGist: voidFunc,
  createSecretGist: voidFunc,
  updateGist: voidFunc,
  notifyClipboardCopySuccess: voidFunc,
  notifyClipboardCopyFailure: voidFunc,

  navigateToCustomFunctions: voidFunc,

  solution: getBoilerplate('EXCEL'),
}

storiesOf('IDE|Header', module)
  .add('basic', () => <Header {...defaultHeaderProps} />)
  .add('custom functions view', () => (
    <Header {...{ ...defaultHeaderProps, isCustomFunctionsView: true }} />
  ))
  .add('settings view', () => (
    <Header {...{ ...defaultHeaderProps, isSettingsView: true }} />
  ))
  .add('logging in', () => (
    <Header {...{ ...defaultHeaderProps, isLoggingInOrOut: true }} />
  ))
