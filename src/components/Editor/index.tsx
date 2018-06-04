import * as React from 'react'
import styled from 'styled-components'

import MonacoEditor from 'react-monaco-editor'

import CommandBar from './CommandBar'

import { ISnippet, ISnippetField } from '../../interfaces'

const EditorWrapper = styled.div`
  grid-area: editor;
  height: 100%;

  padding: 1rem 0;
`

const EditorLayout = styled.div`
  display: grid;
  height: 100%;
  background-color: ${props => props.theme.bg};

  grid-template-columns: auto;
  grid-template-rows: 4rem auto;
  grid-template-areas: 'command-bar' 'editor';
`

// const CommandBar = styled.div`
//   grid-area: command-bar;
//   height: 100%;

//   background-color: ${props => props.theme.darkAccent};
// `

export interface IEditorProps {
  // from redux
  updateSnippet: (
    snippetId: string,
    activeFieldName: string,
    value: string,
  ) => void
  changeActiveField: (fieldName: string) => void
  snippet: ISnippet
  activeField: ISnippetField
  editorValue: string
}

const editorOptions = {
  selectOnLineNumbers: true,
  scrollBeyondLastLine: false,
}

class Editor extends React.Component<IEditorProps> {
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

  onSelect = fieldName => () => {
    console.log(`selected ${fieldName}`)
    this.props.changeActiveField(fieldName)
  }

  updateValue = newValue =>
    this.props.updateSnippet(
      this.props.snippet.id,
      this.props.activeField.name,
      newValue,
    )

  render() {
    const { editorValue, snippet, activeField, changeActiveField } = this.props
    return (
      <EditorLayout>
        {snippet !== undefined && (
          <>
            <CommandBar
              fieldNames={Object.keys(snippet.fields)}
              activeField={activeField.name}
              changeActiveField={changeActiveField}
            />
            <EditorWrapper>
              <MonacoEditor
                theme="vs-dark"
                language={activeField.metadata.language.toLowerCase()}
                value={editorValue}
                options={editorOptions}
                onChange={this.updateValue}
                editorDidMount={this.handleEditorDidMount}
              />
            </EditorWrapper>
          </>
        )}
      </EditorLayout>
    )
  }
}

export default Editor
