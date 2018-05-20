import React from 'react'

import { storiesOf } from '@storybook/react'

import {
  Bar,
  BarButton,
  IDELayout,
  CommandBar,
  Editor,
  EditorLayout,
} from '../src/components'

storiesOf('IDE', module).add('plain layout', () => (
  <IDELayout>
    <Bar style={{ gridArea: 'header' }} bgColor="green" />
    <EditorLayout>
      <CommandBar />
      <Editor />
    </EditorLayout>
    <Bar style={{ gridArea: 'footer' }} bgColor="green" />
  </IDELayout>
))
