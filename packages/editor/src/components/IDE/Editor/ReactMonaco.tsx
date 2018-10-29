import React, { Component } from 'react'

export interface IProps {
  solutionId: string
  file: IFile
  tabSize: number

  editorDidMount: (editor: monaco.editor.IStandaloneCodeEditor) => void
  onValueChange: (solutionId: string, fileId: string, value: string) => void
}

interface IState {
  models: { [id: string]: any }
}

export class ReactMonaco extends Component<IProps, IState> {
  editor
  container

  constructor(props) {
    super(props)
    this.container = React.createRef()
  }

  componentDidMount() {
    const win = window as any
    if (win.monaco !== undefined) {
      this.initializeMonaco()
    } else {
      win.require.config({ baseUrl: '/' })
      win.require(['vs/editor/editor.main'], () => this.initializeMonaco())
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.editor) {
      const { solutionId, file } = this.props

      if (solutionId !== prevProps.solutionId) {
        this.clearAllModels()
      }

      if (file.id !== prevProps.file.id) {
        const newModel = this.getModel()
        newModel.updateOptions({ tabSize: this.props.tabSize })
        this.editor.setModel(newModel)
      }
    }
  }

  componentWillUnmount() {
    if (this.editor) {
      this.editor.dispose()
    }
  }

  initializeMonaco = () => {
    this.editor = monaco.editor.create(this.container.current, {})

    const model = this.getModel()
    model.updateOptions({ tabSize: this.props.tabSize })
    this.editor.setModel(model)

    this.editor.onDidChangeModelContent(event => {
      this.onValueChange()
    })

    this.props.editorDidMount(this.editor)
  }

  onValueChange = () =>
    this.props.onValueChange(
      this.props.solutionId,
      this.props.file.id,
      this.editor.getModel().getValue(),
    )

  private getUri = () =>
    new monaco.Uri().with({
      scheme: 'file',
      path: `${this.props.solutionId}/${this.props.file.id}`,
    })

  private getModel = () => {
    const uri = this.getUri()
    const model = monaco.editor.getModel(uri)

    return model
      ? model
      : monaco.editor.createModel(
          this.props.file.content,
          this.props.file.language.toLowerCase(),
          uri,
        )
  }

  clearAllModels = () => {
    monaco.editor.getModels().forEach(model => model.dispose())
  }

  render() {
    return (
      <div ref={this.container} style={{ width: '100%', height: '100%' }} role="main" />
    )
  }
}

export default ReactMonaco
