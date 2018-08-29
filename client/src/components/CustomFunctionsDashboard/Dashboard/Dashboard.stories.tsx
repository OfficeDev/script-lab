import React from 'react'

import Dashboard from './'
import { BasicSummary } from '../Summary/Summary.stories'
import { BasicConsole } from '../Console/Console.stories'
import { storiesOf } from '@storybook/react'

const stories = storiesOf('CustomFunctions/Dashboard', module)

const Dummy = ({ letter }) => <div>I AM {letter}</div>

stories
  .add('basic', () => (
    <Dashboard
      items={{
        Alpha: <Dummy letter="A" />,
        Bravo: <Dummy letter="B" />,
        Charlie: <Dummy letter="C" />,
      }}
    />
  ))
  .add('with actual tabs', () => (
    <Dashboard items={{ Summary: <BasicSummary />, Console: <BasicConsole /> }} />
  ))
