import React from 'react'

import { storiesOf } from '@storybook/react'

import IDE from '../src/components/IDE'

import Bar from '../src/components/Bar'
import BarButton from '../src/components/BarButton'

storiesOf('IDE', module).add('plain', () => (
  <IDE>
    <Bar />
  </IDE>
))
