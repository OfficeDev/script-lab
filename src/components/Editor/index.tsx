import * as React from 'react'
import styled from 'styled-components'

import MonacoEditor from 'react-monaco-editor'
import { ISnippet, ISnippetField } from '../../interfaces'

const EditorLayout = styled.div`
  display: grid;
  height: 100%;
  background-color: ${props => props.theme.bg};

  grid-template-columns: auto;
  grid-template-rows: 4.4rem auto;
  grid-template-areas: 'command-bar' 'editor';
`

const EditorWrapper = styled.div`
  grid-area: editor;
  height: 100%;

  padding: 1rem 0;
`

const CommandBar = styled.div`
  grid-area: command-bar;
  height: 100%;

  background-color: ${props => props.theme.darkAccent};
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

const editorOptions = {
  selectOnLineNumbers: true,
  scrollBeyondLastLine: false,
}

class Editor extends React.Component<IProps> {
  editor
  resizeListener

  editorDidMount(editor, monaco) {
    editor.focus()
  }

  handleEditorDidMount = editor => (this.editor = editor)
  handleResize = () => this.editor.layout()

  componentDidMount() {
    this.resizeListener = window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener)
  }

  updateValue = newValue =>
    this.props.updateSnippet(
      this.props.snippet.id,
      this.props.activeField.name,
      newValue,
    )

  render() {
    const { editorValue } = this.props
    return (
      <EditorLayout>
        <CommandBar>asdf</CommandBar>
        <EditorWrapper>
          <MonacoEditor
            theme="vs-dark"
            language="typescript"
            value={editorValue}
            options={editorOptions}
            onChange={this.updateValue}
            editorDidMount={this.handleEditorDidMount}
          />
        </EditorWrapper>
      </EditorLayout>
    )
  }
}

export default Editor
