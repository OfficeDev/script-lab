import React from 'react'

import debounce from 'lodash/debounce'

export interface IProps {
  solutionId: string
  file: IFile

  options: Partial<monaco.editor.IEditorConstructionOptions>

  editorDidMount: (editor, monaco) => void
  onValueChange: (solutionId: string, fileId: string, value: string) => void
}
interface IState {
  models: { [id: string]: any }
}

export class Monaco extends React.Component<IProps, IState> {
  editor
  container
  state = { models: {} }

  constructor(props) {
    super(props)
    this.container = React.createRef()
  }

  componentDidMount() {
    console.log('componentDidMount')

    const win = window as any
    if (win.monaco !== undefined) {
      this.initializeMonaco()
    } else {
      win.require.config({ baseUrl: '/' })

      win.require(['vs/editor/editor.main'], () => this.initializeMonaco())
    }
  }

  componentDidUpdate(prevProps: IProps) {
    console.log('componentDidUpdate')
    console.log({ prevProps, props: this.props })

    if (this.editor) {
      const { solutionId, file } = this.props

      if (solutionId !== prevProps.solutionId) {
        console.log('solution changed!')
        this.clearAllModels()
      }

      if (file.id !== prevProps.file.id) {
        console.log('file changed!')
        const newModel = this.getModel()
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
    console.log('initializing monaco')
    const { solutionId, file, options } = this.props

    this.editor = monaco.editor.create(this.container.current, options)

    const model = this.getModel()
    this.editor.setModel(model)

    this.editor.onDidChangeModelContent(event => {
      this.onValueChange()
    })

    this.props.editorDidMount(this.editor, monaco)
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
    monaco.editor
      .getModels()
      .filter(model => !model.isDisposed)
      .forEach(model => model.dispose())
  }

  render() {
    return (
      <div ref={this.container} style={{ width: '100%', height: '100%' }} role="main" />
    )
  }
}

export default Monaco
