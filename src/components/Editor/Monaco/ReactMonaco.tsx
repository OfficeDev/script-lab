import React, { Component } from 'react'
import styled from 'styled-components'

interface IReactMonacoProps {
  theme: string
  options: monaco.editor.IEditorConstructionOptions
  editorDidMount: (editor, monaco) => void
}

class ReactMonaco extends Component<IReactMonacoProps> {
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
    const win = window as any
    if (win.monaco !== undefined) {
      this.initializeMonaco()
    } else {
      win.require.config({
        url: 'vs/loader.js',
        paths: {
          vs: 'vs',
        },
      })

      win.require(['../../vs/editor/editor.main'], () => this.initializeMonaco())
    }
  }

  componentWillUnmount() {
    this.deinitializeMonaco()
  }

  editorDidMount = (editor, monaco) => this.props.editorDidMount(editor, monaco)

  initializeMonaco = () => {
    const { theme, options } = this.props
    const win = window as any
    if (this.container.current && win.monaco !== undefined) {
      this.editor = monaco.editor.create(this.container.current, {
        ...options,
      })

      if (theme) {
        monaco.editor.setTheme(theme)
      }

      this.editorDidMount(this.editor, monaco)
    }
  }

  deinitializeMonaco = () => {
    if (this.editor !== undefined) {
      this.editor.dispose()
    }
  }

  render() {
    return <div ref={this.container} style={{ width: '100%', height: '100%' }} />
  }
}

export default ReactMonaco
