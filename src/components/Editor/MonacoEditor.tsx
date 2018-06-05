import React, { Component } from 'react'
import styled from 'styled-components'

interface IMonacoOptions {
  selectOnLineNumbers: boolean
  scrollBeyondLastLine: boolean
}

interface IMonacoEditorProps {
  value: string
  language: string
  theme: string
  options: IMonacoOptions
  editorDidMount: (editor, monaco) => void
  onChange: (currentValue: string, event) => void
}

class MonacoEditor extends Component<IMonacoEditorProps> {
  container: React.RefObject<HTMLDivElement>
  editor: monaco.editor.IStandaloneCodeEditor
  value: string
  pauseCallingOnChange: boolean

  constructor(props) {
    super(props)
    this.container = React.createRef()
    this.pauseCallingOnChange = false
  }

  componentDidMount() {
    this.initializeMonaco()
  }

  componentWillUnmount() {
    this.deinitializeMonaco()
  }

  componentDidUpdate(prevProps) {
    const { value, language, theme } = this.props

    if (value !== this.value) {
      this.value = value

      if (this.editor) {
        this.pauseCallingOnChange = true
        this.editor.setValue(this.value)
        this.pauseCallingOnChange = false
      }
    }

    if (language !== prevProps.language) {
      monaco.editor.setModelLanguage(this.editor.getModel(), language)
    }

    if (theme !== prevProps.theme) {
      monaco.editor.setTheme(theme)
    }
  }

  initializeMonaco = () => {
    const { language, theme, options, value } = this.props

    if (this.container.current) {
      this.editor = monaco.editor.create(this.container.current, {
        value,
        language,
        ...options,
      })

      if (theme) {
        monaco.editor.setTheme(theme)
      }

      this.editorDidMount(this.editor)
    }
  }

  deinitializeMonaco = () => {
    if (this.editor !== undefined) {
      this.editor.dispose()
    }
  }

  editorDidMount = editor => {
    this.props.editorDidMount(editor, monaco)

    editor.onDidChangeModelContent(event => {
      const currentValue = editor.getValue()

      this.value = currentValue

      if (!this.pauseCallingOnChange) {
        this.props.onChange(currentValue, event)
      }
    })
  }

  render() {
    return (
      <div ref={this.container} style={{ width: '100%', height: '100%' }} />
    )
  }
}

export default MonacoEditor
