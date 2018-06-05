import React, { Component } from 'react'
import styled from 'styled-components'
import CommandBar from './CommandBar'
import Monaco from './Monaco'
import { ISnippet, ISnippetField } from '../../interfaces'
import { changeActiveField } from '../../actions'
import { createAllModelsForSnippet, getModel } from './Monaco/monaco-models'

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

  onChange: (newValue: string) => void
}

class Editor extends Component<IEditorProps> {
  editor: monaco.editor.IStandaloneCodeEditor
  monaco: any
  activeFile: ISnippetField

  constructor(props) {
    super(props)

    this.activeFile = Object.keys(this.props.snippet.fields).map(
      k => this.props.snippet.fields[k],
    )[0]
  }

  setupEditor = (editor: monaco.editor.IStandaloneCodeEditor, monaco: any) => {
    this.editor = editor
    this.monaco = monaco

    requestAnimationFrame(() => {
      editor.onDidChangeModelContent(event => {
        this.handleChange()
      })
    })

    createAllModelsForSnippet(this.monaco, this.props.snippet)
    this.changeActiveFile(this.activeFile)
  }

  getMonacoOptions = (): monaco.editor.IEditorConstructionOptions => {
    const fontSize = 16

    return {
      selectOnLineNumbers: true,
      fontSize,
      fontFamily: ['Menlo', 'Source Code Pro', 'monospace']
        .map(
          fontName =>
            fontName.includes(' ') ? JSON.stringify(fontName) : fontName,
        )
        .join(', '),
      minimap: { enabled: false },
      formatOnPaste: true,
      lineHeight: 1.5 * fontSize,
      folding: true,
      glyphMargin: false,
      fixedOverflowWidgets: true,
      ariaLabel: 'todo',
    }
  }

  handleChange = () => {
    const newValue = this.editor.getModel().getValue() || ''
    const oldValue = this.props.activeField.value

    const codeHasChanged =
      newValue.replace(/\r\n/g, '\n') !== oldValue.replace(/\r\n/g, '\n')

    if (codeHasChanged) {
      if (this.props.onChange) {
        this.props.onChange(newValue)
      }
    }
  }

  changeActiveFile = (field: ISnippetField) => {
    console.log(field)
    const cachedModel = getModel(this.monaco, this.props.snippet.id, field)

    this.editor.setModel(cachedModel.model)

    requestAnimationFrame(() => {
      if (cachedModel.cursorPos) {
        this.editor.setPosition(cachedModel.cursorPos)
        this.editor.revealPosition(cachedModel.cursorPos)
      }
    })
  }

  render() {
    const options = this.getMonacoOptions()

    return (
      <EditorLayout>
        <CommandBar
          fields={Object.keys(this.props.snippet.fields).map(
            k => this.props.snippet.fields[k],
          )}
          activeField={this.activeFile}
          changeActiveField={this.changeActiveFile}
        />
        <EditorWrapper>
          <Monaco
            theme="vs-dark"
            options={options}
            editorDidMount={this.setupEditor}
          />
        </EditorWrapper>
      </EditorLayout>
    )
  }
}

export default Editor
