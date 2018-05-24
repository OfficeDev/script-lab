import React from 'react'

import { storiesOf } from '@storybook/react'

import { Function, RunPane } from '../src/components'

storiesOf('Run Pane', module).add('basic', () => (
  <RunPane>
    {Array.from(Array(50).keys()).map(n => <Function name={`function${n}`} />)}
  </RunPane>
))
