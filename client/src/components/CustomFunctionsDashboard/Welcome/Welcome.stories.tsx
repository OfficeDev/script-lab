import React from 'react'
import { storiesOf } from '@storybook/react'

import { Welcome } from './'

const voidFunc = () => {}

storiesOf('CustomFunctions/Welcome', module)
  .add('can refresh', () => <Welcome isRefreshEnabled={true} refresh={voidFunc} />)
  .add('cannot refresh', () => <Welcome isRefreshEnabled={false} refresh={voidFunc} />)
