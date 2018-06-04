import React from 'react'
import styled from 'styled-components'

import { storiesOf } from '@storybook/react'
import { object } from '@storybook/addon-knobs'

import { Editor, IEditorProps } from '../src/components'

import { Snippet1 } from './sampleData'

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
    snippet={object('Snippet', Snippet1)}
    activeField={Snippet1.fields.Script}
    editorValue={Snippet1.fields.Script.value}
  />
))
