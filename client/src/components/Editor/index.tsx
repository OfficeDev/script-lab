import React, { Component } from 'react'
import Monaco from './Monaco'
import { getModel, setPosForModel } from './Monaco/monaco-models'
import { Layout } from './styles'

export interface IEditorProps {
  activeSolution: ISolution
  files: IFile[]
  activeFile: IFile

  backgroundColor: string
  monacoTheme: string
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

        if (oldFile.id === newFile.id) {
          return
        }
      }

      const cachedModel = getModel(this.monaco, newFile)
      this.editor.setModel(cachedModel.model)
      requestAnimationFrame(() => {
        if (cachedModel.cursorPos) {
          this.editor.setPosition(cachedModel.cursorPos)
          this.editor.revealPosition(cachedModel.cursorPos)

          // this.editor.focus() cant include this here because
          // it would break keyboard accessibility, or at least
          // make it a pain to use
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
    const { files, backgroundColor } = this.props
    const options = this.getMonacoOptions()
    const libraries = files.find(file => file.name === 'libraries.txt')

    return (
      <Layout style={{ backgroundColor }}>
        <Monaco
          theme={this.props.monacoTheme}
          options={options}
          editorDidMount={this.setupEditor}
          libraries={libraries && libraries.content}
        />
      </Layout>
    )
  }
}

export default Editor
