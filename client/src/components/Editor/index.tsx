import React, { Component } from 'react'
import Monaco from './Monaco'
import { getModel, setPosForModel } from './Monaco/monaco-models'
import { Layout } from './styles'

export interface IEditorProps {
  activeSolution: ISolution
  files: IFile[]
  activeFile: IFile

  changeActiveFile: (fileId: string) => void
  editFile: (
    solutionId: string,
    fileId: string,
    file: Partial<IEditableFileProperties>,
  ) => void
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
    this.changeActiveFile(prevProps.activeFile, this.props.activeFile)
  }

  changeActiveFile = (oldFile: IFile | null, newFile: IFile) => {
    if (this.editor && newFile) {
      if (oldFile) {
        setPosForModel(oldFile.id, this.editor.getPosition())
      }

      const cachedModel = getModel(this.monaco, newFile)
      this.editor.setModel(cachedModel.model)
      requestAnimationFrame(() => {
        if (cachedModel.cursorPos) {
          this.editor.setPosition(cachedModel.cursorPos)
          this.editor.revealPosition(cachedModel.cursorPos)
        }
      })
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

    this.changeActiveFile(null, this.props.activeFile)

    window.addEventListener('resize', this.resizeEditor)

    // this.editorLayoutInterval = setInterval(this.resizeEditor, 3000)
  }

  getMonacoOptions = (): monaco.editor.IEditorConstructionOptions => {
    const fontSize = 16

    return {
      selectOnLineNumbers: true,
      fontSize,
      fontFamily: ['Menlo', 'Source Code Pro', 'Consolas', 'Courier New', 'monospace']
        .map(fontName => (fontName.includes(' ') ? JSON.stringify(fontName) : fontName))
        .join(', '),
      minimap: { enabled: false },
      scrollbar: {
        vertical: 'visible',
        arrowSize: 15,
      },
      formatOnPaste: true,
      lineHeight: 1.3 * fontSize,
      folding: true,
      glyphMargin: false,
      fixedOverflowWidgets: true,
      ariaLabel: 'todo',
    }
  }

  handleChange = () => {
    const newValue = this.editor.getModel().getValue() || ''
    const oldValue = this.props.activeFile.content

    const copy = this.props.activeFile
    copy.content = newValue

    // const codeHasChanged =
    // newValue.replace(/\r\n/g, "\n") !== oldValue.replace(/\r\n/g, "\n");

    this.props.editFile(this.props.activeSolution.id, this.props.activeFile.id, copy)
    // if (codeHasChanged) {

    // }
  }

  // todo debounce
  resizeEditor = () => {
    console.info('editor resizing!')
    this.forceUpdate(() => {
      this.editor.layout()
    })
  }

  render() {
    const { files, activeFile, activeSolution } = this.props
    const options = this.getMonacoOptions()

    return (
      <Layout>
        <Monaco
          theme="vs-dark"
          options={options}
          editorDidMount={this.setupEditor}
          libraries={activeSolution.libraries}
        />
      </Layout>
    )
  }
}

export default Editor
