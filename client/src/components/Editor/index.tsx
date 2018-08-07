import React, { Component } from 'react'
import prettier from 'prettier/standalone'
import prettierTypeScript from 'prettier/parser-typescript'
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button'
import Monaco from './Monaco'
import { getModel, setPosForModel } from './Monaco/monaco-models'
import { Layout } from './styles'
import debounce from 'lodash/debounce'

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
  formatBinding: any
  monaco: any

  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    this.formatBinding.dispose()
  }

  componentDidUpdate(prevProps) {
    this.changeActiveFile(prevProps.activeFile, this.props.activeFile)
  }

  prettifyCode = () => {
    console.log('prettify called')
    const model = this.editor.getModel()
    const unformatted = model.getValue()
    if (unformatted) {
      const formatted = prettier.format(unformatted, {
        parser: 'typescript',
        plugins: [prettierTypeScript],
      })

      if (formatted !== unformatted) {
        console.log('setting model')
        model.setValue(formatted)
      }
    }
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

    this.formatBinding = editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_F,
      this.prettifyCode,
      '',
    )

    this.changeActiveFile(null, this.props.activeFile)

    window.addEventListener('resize', debounce(this.resizeEditor, 500))
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

    this.props.editFile(this.props.activeSolution.id, this.props.activeFile.id, copy)
  }

  resizeEditor = () => {
    this.forceUpdate(() => {
      this.editor.layout()
    })
  }

  render() {
    const { files, backgroundColor, monacoTheme } = this.props
    const options = this.getMonacoOptions()
    const libraries = files.find(file => file.name === 'libraries.txt')

    return <Layout style={{ backgroundColor }}>
        {/* <div style={{ // backgroundColor: '#555',
            padding: '.5rem', display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <DefaultButton text="Restore Defaults" style={{ marginLeft: '1rem', float: 'left' }} styles={{ root: { backgroundColor: '#B33A3A', color: 'white'} }} />
          <div>
            <DefaultButton text="Apply" primary={true} style={{ marginLeft: '1rem' }} />
            <DefaultButton text="Cancel" style={{ marginLeft: '1rem' }} />
          </div>
        </div> */}
        <Monaco theme={monacoTheme} options={options} editorDidMount={this.setupEditor} libraries={libraries && libraries.content} />
      </Layout>
  }
}

export default Editor
