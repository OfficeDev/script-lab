import React from 'react'
import { storiesOf } from '@storybook/react'

import LoadingIndicator from './index'

storiesOf('Loading Indicator', module).add('basic', () => (
  <LoadingIndicator ballSize={32} numBalls={10} ballColor="rebeccapurple" delay={0.05} />
))
