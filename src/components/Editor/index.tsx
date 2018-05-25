import * as React from 'react'
import styled from 'styled-components'

import MonacoEditor from 'react-monaco-editor'

const EditorWrapper = styled.div`
  height: 100%;
  padding: 1rem 0;

  background-color: ${props => props.theme.bg};
`

class Editor extends React.Component {
  state = { value: '' }

  updateValue = newValue => this.setState({ value: newValue })

  render() {
    return (
      <EditorWrapper>
        <MonacoEditor
          theme="vs-dark"
          language="typescript"
          value={this.state.value}
          onChange={this.updateValue}
        />
      </EditorWrapper>
    )
  }
}

export default Editor
