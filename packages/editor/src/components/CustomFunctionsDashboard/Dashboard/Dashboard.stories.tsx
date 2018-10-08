import React from 'react'

import { Dashboard } from './'
import { BasicSummary } from '../Summary/Summary.stories'
import { BasicConsole } from '../Console/Console.stories'
import { storiesOf } from '@storybook/react'
import { getCommandBarFabricTheme } from '../../../theme'

const commandBarFabricTheme = getCommandBarFabricTheme('EXCEL')
const Dummy = ({ letter }) => <div>I AM {letter}</div>

storiesOf('Custom Functions|Dashboard', module)
  .add('basic', () => (
    <Dashboard
      commandBarFabricTheme={commandBarFabricTheme}
      items={{
        Alpha: <Dummy letter="A" />,
        Bravo: <Dummy letter="B" />,
        Charlie: <Dummy letter="C" />,
      }}
      shouldPromptRefresh={false}
      isStandalone={false}
    />
  ))
  .add('with actual tabs', () => (
    <Dashboard
      commandBarFabricTheme={commandBarFabricTheme}
      items={{ Summary: <BasicSummary />, Console: <BasicConsole /> }}
      shouldPromptRefresh={false}
      isStandalone={false}
    />
  ))
  .add('with refresh', () => (
    <Dashboard
      commandBarFabricTheme={commandBarFabricTheme}
      items={{ Summary: <BasicSummary />, Console: <BasicConsole /> }}
      shouldPromptRefresh={true}
      isStandalone={false}
    />
  ))
  .add('as standalone', () => (
    <Dashboard
      commandBarFabricTheme={commandBarFabricTheme}
      items={{ Summary: <BasicSummary />, Console: <BasicConsole /> }}
      shouldPromptRefresh={true}
      isStandalone={true}
    />
  ))
