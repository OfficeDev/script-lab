import React from 'react'

import { storiesOf } from '@storybook/react'

import { IDE } from '../src/components'

import { Bar } from '../src/components'
import { BarButton } from '../src/components'

storiesOf('IDE', module).add('plain', () => (
  <IDE>
    <Bar style={{ gridTemplateArea: 'header' }} bgColor="green" />
    <Bar style={{ gridTemplateArea: 'command-bar' }} bgColor="red" />
    <Bar style={{ gridTemplateArea: 'editor' }} bgColor="blue" />
    <Bar style={{ gridTemplateArea: 'footer' }} bgColor="purple" />
  </IDE>
))
