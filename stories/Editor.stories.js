import React from 'react'
import styled from 'styled-components'

import { storiesOf } from '@storybook/react'
import { object } from '@storybook/addon-knobs'

import { Editor, IEditorProps } from '../src/components'

import { entities } from './sampleData'

const fakeChangeFile = file => {}
const fakeEditFile = file => {}

const Wrapper = styled.div`
  height: 100vh;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-template-areas: 'editor';
`

const stories = storiesOf('Editor', module)
stories.addDecorator(storyFn => <Wrapper>{storyFn()}</Wrapper>)

stories.add('basic', () => (
  <Editor
    files={Object.values(entities.files)}
    activeFile={Object.values(entities.files)[0]}
    editFile={fakeEditFile}
    changeActiveFile={fakeChangeFile}
  />
))
