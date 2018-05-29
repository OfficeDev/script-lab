import * as React from 'react'
import styled from 'styled-components'

import MonacoEditor from 'react-monaco-editor'
import { ISnippet, ISnippetField } from '../../interfaces'

const EditorWrapper = styled.div`
  height: 100%;
  padding: 1rem 0;

  background-color: ${props => props.theme.bg};
`

interface IProps {
  // from redux
  updateSnippet: (
    snippetId: string,
    activeFieldName: string,
    value: string,
  ) => void
  snippet: ISnippet
  activeField: ISnippetField
  editorValue: string
}

class Editor extends React.Component<IProps> {
  updateValue = newValue =>
    this.props.updateSnippet(
      this.props.snippet.id,
      this.props.activeField.name,
      newValue,
    )

  render() {
    const { editorValue } = this.props
    return (
      <EditorWrapper>
        <MonacoEditor
          theme="vs-dark"
          language="typescript"
          value={editorValue}
          onChange={this.updateValue}
        />
      </EditorWrapper>
    )
  }
}

export default Editor
