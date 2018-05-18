import React from 'react'

import { storiesOf } from '@storybook/react'

import Bar from '../src/components/Bar'
import BarButton from '../src/components/BarButton'

storiesOf('Bar', module)
  .add('without buttons', () => <Bar height={50} bgColor="rebeccapurple" />)
  .add('with buttons', () => (
    <Bar bgColor="darkgreen" height={44}>
      {['Foo', 'Bar', 'Spam', 'Eggs'].map(label => (
        <BarButton>{label}</BarButton>
      ))}
    </Bar>
  ))
  .add('right aligned', () => (
    <Bar bgColor="darkgreen" height={44} justify="flex-end">
      {['Foo', 'Bar', 'Spam', 'Eggs'].map(label => (
        <BarButton>{label}</BarButton>
      ))}
    </Bar>
  ))
  .add('left and right in same bar', () => (
    <Bar bgColor="darkgreen" height={44}>
      <Bar>
        {['I', 'Am', 'Left'].map(label => <BarButton>{label}</BarButton>)}
      </Bar>
      <Bar justify="flex-end">
        {['I', 'Am', 'Right'].map(label => <BarButton>{label}</BarButton>)}
      </Bar>
    </Bar>
  ))
