import React, { Component } from 'react'
import styled from 'styled-components'
import FileSwitcher from './FileSwitcher'
import Monaco from './Monaco'
import { getModel, setPosForModel } from './Monaco/monaco-models'
import { Wrapper, Layout } from './styles'

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
  currentMonacoModel: any

  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
    const { activeFile } = this.props
    console.log('EDITOR DID UPDATE: ')
    console.log(`PrevId: ${prevProps.activeFile.id}, NewId: ${activeFile.id}`)
    // TODO: consolidate logic between here and changeActiveFileFromPivot
    if (activeFile.id !== prevProps.activeFile.id) {
      const cachedModel = getModel(this.monaco, activeFile)
      this.editor.setModel(cachedModel.model)
    }
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
    this.changeActiveFileFromPivot(this.props.activeFile)

    window.addEventListener('resize', this.resizeEditor)

    // this.editorLayoutInterval = setInterval(this.resizeEditor, 3000)
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

  changeActiveFileFromPivot = (file: any) => {
    setPosForModel(this.props.activeFile.id, this.editor.getPosition())
    const cachedModel = getModel(this.monaco, file)
    this.editor.setModel(cachedModel.model)
    requestAnimationFrame(() => {
      if (cachedModel.cursorPos) {
        this.editor.setPosition(cachedModel.cursorPos)
        this.editor.revealPosition(cachedModel.cursorPos)
        this.editor.focus()
      }
    })

    this.props.changeActiveFile(file.id)
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
      <Layout>
        <FileSwitcher
          files={files}
          activeFile={activeFile}
          changeActiveFile={this.changeActiveFileFromPivot}
        />
        <Wrapper>
          <Monaco theme="vs-dark" options={options} editorDidMount={this.setupEditor} />
        </Wrapper>
      </Layout>
    )
  }
}

export default Editor
