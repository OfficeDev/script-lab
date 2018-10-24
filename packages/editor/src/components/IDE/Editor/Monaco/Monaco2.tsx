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
      console.log(this.getUri() === this.getUri())
      const { solutionId, file } = this.props
      // const { theme } = options

      // this.editor.updateOptions(options)
      // if (theme) {
      //   this.editor.setTheme()
      // }

      if (solutionId !== prevProps.solutionId) {
        console.log('solution changed!')
        this.clearAllModels()
      }

      if (file.id !== prevProps.file.id) {
        console.log('file changed!')
        const newModel = this.getModel()
        console.log({ newModel })
        console.log(newModel.getValue())
        // this.editor.setModel(null)
        this.editor.setModel(newModel)
      }

      // const model = this.editor.getModel()

      // if (value !== model.getValue()) {
      //   model.pushEditOperations([], [{ range: model.getFullModelRange(), text: value }])
      // }
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

    console.log(this.getUri())
    const model = this.getModel()
    console.log(model.getValue())
    this.editor.setModel(model)

    this.editor.onDidChangeModelContent = this.onValueChange
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
    // if (Object.keys(this.state.models).includes(this.props.file.id)) {
    //   return this.state.models[this.props.file.id]
    // } else {
    //   const model = monaco.editor.createModel(
    //     this.props.file.content,
    //     this.props.file.language.toLowerCase(),
    //     this.getUri(),
    //   )
    //   this.setState({ models: { ...this.state.models, [this.props.file.id]: model } })
    //   return model
    // }
    const uri = this.getUri()
    const model = monaco.editor.getModel(uri)
    console.log({ uri, model })
    if (model) {
      console.log('returning cached model')
      return model
    } else {
      console.log('returning newly created model')
      const model = monaco.editor.createModel(
        this.props.file.content,
        this.props.file.language,
        this.getUri(),
      )
      return model
    }
    // // return model
    // //   ? model
    // //   :
  }

  clearAllModels = () => {
    // Note: if we use more than one instance of monaco in the future
    // this might cause some trouble since it isn't this.editor.getModels() (as that doesn't seem to exist for some reason on this.editor)
    console.log(monaco.editor.getModels().filter(model => !model.isDisposed))
    // monaco.editor
    //   .getModels()
    //   .filter(model => !model.isDisposed)
    //   .forEach(model => model.dispose())
  }

  render() {
    return (
      <div ref={this.container} style={{ width: '100%', height: '100%' }} role="main" />
    )
  }
}

export default Monaco
