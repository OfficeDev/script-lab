import React from 'react'

import { storiesOf } from '@storybook/react'

import { Bar, CommandBar, Editor, EditorLayout } from '../src/components'

storiesOf('Editor', module).add('plain layout', () => (
  <EditorLayout>
    <CommandBar />
    <Bar style={{ gridArea: 'editor' }} bgColor="papayawhip" />
  </EditorLayout>
))
