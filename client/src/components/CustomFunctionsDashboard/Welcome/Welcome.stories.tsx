import React from 'react'
import { storiesOf } from '@storybook/react'

import { Welcome } from './'

storiesOf('CustomFunctions/Welcome', module)
  .add('can refresh', () => <Welcome isRefreshEnabled={true} />)
  .add('cannot refresh', () => <Welcome isRefreshEnabled={false} />)
