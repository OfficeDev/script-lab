import React, { Component } from 'react'
import styled from 'styled-components'
import CommandBar from './CommandBar'
import Monaco from './Monaco'
import { ISnippet, ISnippetFile } from '../../interfaces'
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
  snippet: ISnippet
  activeFile: ISnippetFile

  changeActiveFile: (fileName: string) => void

  onChange: (newValue: string) => void
}

class Editor extends Component<IEditorProps> {
  editor: monaco.editor.IStandaloneCodeEditor
  monaco: any

  constructor(props) {
    super(props)
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
    this.changeActiveFile(this.props.activeFile)
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
    const oldValue = this.props.activeFile.value

    const codeHasChanged =
      newValue.replace(/\r\n/g, '\n') !== oldValue.replace(/\r\n/g, '\n')

    if (codeHasChanged) {
      if (this.props.onChange) {
        this.props.onChange(newValue)
      }
    }
  }

  changeActiveFile = (file: ISnippetFile) => {
    console.log(file)
    this.setState({ activeFile: file })

    this.props.changeActiveFile(file.name)
    const cachedModel = getModel(this.monaco, this.props.snippet.id, file)

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
          fields={Object.keys(this.props.snippet.files).map(
            k => this.props.snippet.files[k],
          )}
          activeField={this.props.activeFile}
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
