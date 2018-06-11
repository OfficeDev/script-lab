import React, { Component } from 'react'
import styled from 'styled-components'
import FileSwitcher from './FileSwitcher'
import Monaco from './Monaco'
import { ISnippet, ISnippetFile } from '../../interfaces'
import { getModel } from './Monaco/monaco-models'
import { IFile } from '../../stores/files'

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
  files: any[]
  activeFile: any

  changeActiveFile: (fileId: string) => void
  editFile: (file: IFile) => void
}

class Editor extends Component<IEditorProps> {
  editor: monaco.editor.IStandaloneCodeEditor
  editorLayoutInterval: any
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

    // createAllModelsForSnippet(this.monaco, this.props.files)
    this.changeActiveFile(this.props.activeFile)

    window.addEventListener('resize', this.resizeEditor)
    this.editorLayoutInterval = setInterval(this.resizeEditor, 3000)
  }

  getMonacoOptions = (): monaco.editor.IEditorConstructionOptions => {
    const fontSize = 16

    return {
      selectOnLineNumbers: true,
      fontSize,
      fontFamily: ['Menlo', 'Source Code Pro', 'monospace']
        .map(fontName => (fontName.includes(' ') ? JSON.stringify(fontName) : fontName))
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

    const copy = this.props.activeFile
    copy.content = newValue

    // const codeHasChanged =
    // newValue.replace(/\r\n/g, "\n") !== oldValue.replace(/\r\n/g, "\n");

    this.props.editFile(copy)
    // if (codeHasChanged) {

    // }
  }

  changeActiveFile = (file: any) => {
    // console.log(file)
    // this.setState({ activeFile: file })
    if (file) {
      this.props.changeActiveFile(file.id)
    }
    const cachedModel = getModel(this.monaco, file)
    this.editor.setModel(cachedModel.model)
    requestAnimationFrame(() => {
      if (cachedModel.cursorPos) {
        this.editor.setPosition(cachedModel.cursorPos)
        this.editor.revealPosition(cachedModel.cursorPos)
      }
    })
  }

  // todo debounce
  resizeEditor = () => {
    console.info('editor resizing!')
    this.forceUpdate(() => {
      this.editor.layout()
    })
  }

  render() {
    console.log(this.props)
    const { files, activeFile } = this.props
    const options = this.getMonacoOptions()

    return (
      <EditorLayout>
        <FileSwitcher
          files={files}
          activeFile={activeFile}
          changeActiveFile={this.changeActiveFile}
        />
        <EditorWrapper>
          <Monaco theme="vs-dark" options={options} editorDidMount={this.setupEditor} />
        </EditorWrapper>
      </EditorLayout>
    )
  }
}

export default Editor
