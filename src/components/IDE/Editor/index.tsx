import * as React from 'react'

import CommandBar from './CommandBar'
import Editor from './Editor'
import EditorLayout from './EditorLayout'

export default props => (
  <EditorLayout>
    <CommandBar />
    <Editor />
  </EditorLayout>
)
