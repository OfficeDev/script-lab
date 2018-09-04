import React from 'react'

import { Dashboard } from './'
import { BasicSummary } from '../Summary/Summary.stories'
import { BasicConsole } from '../Console/Console.stories'
import { storiesOf } from '@storybook/react'
import { getHeaderFabricTheme } from '../../../theme'

const headerFabricTheme = getHeaderFabricTheme('EXCEL')
const stories = storiesOf('CustomFunctions/Dashboard', module)

const Dummy = ({ letter }) => <div>I AM {letter}</div>

stories
  .add('basic', () => (
    <Dashboard
      headerFabricTheme={headerFabricTheme}
      items={{
        Alpha: <Dummy letter="A" />,
        Bravo: <Dummy letter="B" />,
        Charlie: <Dummy letter="C" />,
      }}
    />
  ))
  .add('with actual tabs', () => (
    <Dashboard
      headerFabricTheme={headerFabricTheme}
      items={{ Summary: <BasicSummary />, Console: <BasicConsole /> }}
    />
  ))
