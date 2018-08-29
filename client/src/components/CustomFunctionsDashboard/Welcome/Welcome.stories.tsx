import React from 'react'

import Welcome from './'
import { storiesOf } from '@storybook/react'

const stories = storiesOf('CustomFunctions/Welcome', module)

const voidFunc = () => {}

stories
  .add('can refresh', () => <Welcome isRefreshEnabled={true} refresh={voidFunc} />)
  .add('cannot refresh', () => <Welcome isRefreshEnabled={false} refresh={voidFunc} />)
