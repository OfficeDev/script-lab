import React, { Component } from 'react'
import officeDts from './office'

interface IDisposableFile {
  url: string
  disposable: monaco.IDisposable
}
function parse(libraries: string[]): string[] {
  return libraries
    .map(library => {
      library = library.trim()

      if (/^@types/.test(library)) {
        return `https://unpkg.com/${library}/index.d.ts`
      } else if (/^dt~/.test(library)) {
        const libName = library.split('dt~')[1]
        return `https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/${libName}/index.d.ts`
      } else if (/\.d\.ts$/i.test(library)) {
        if (/^https?:/i.test(library)) {
          return library
        } else {
          return `https://unpkg.com/${library}`
        }
      } else {
        return null
      }
    })
    .filter(x => x !== null)
    .map(x => x!)
}

interface IReactMonaco {
  theme: string
  options: monaco.editor.IEditorConstructionOptions
  editorDidMount: (editor, monaco) => void
  libraries: string[]
}

interface IReactMonacoState {
  intellisenseFiles: IDisposableFile[]
}

class ReactMonaco extends Component<IReactMonaco, IReactMonacoState> {
  state = { intellisenseFiles: [] as IDisposableFile[] }
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
        baseUrl: '/',
      })

      win.require(['vs/editor/editor.main'], () => this.initializeMonaco())
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
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        officeDts,
        '/office.d.ts',
      )
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

  componentDidUpdate(prevProps, prevState) {
    const win = window as any

    if (this.container.current && win.monaco !== undefined) {
      const oldLibs = this.state.intellisenseFiles.map(file => file.url)
      const newLibs = this.props.libraries

      if (
        !(oldLibs.length === newLibs.length && oldLibs.every((v, i) => v === newLibs[i]))
      ) {
        const oldIntellisenseFiles = this.state.intellisenseFiles
        const newIntellisenseFiles = parse(newLibs)
        console.log(this.state)
        console.log(prevState)
        console.log(newIntellisenseFiles)
        console.log(
          newIntellisenseFiles.filter(
            url => !oldIntellisenseFiles.find(file => file.url === url),
          ),
        )
        newIntellisenseFiles
          .filter(url => !oldIntellisenseFiles.find(file => file.url === url))
          .forEach(url => {
            console.log(`going to fetch ${url}`)
            fetch(url)
              .then(resp => resp.text())
              .then(content => {
                if (!this.state.intellisenseFiles.find(file => file.url === url)) {
                  // TODO: figure out if there's a better way to do this
                  // NOTE: I had to add this extra check here because this page would receive multiple updates for routing reasons,
                  // and that would cause the fetch to occur multiple times since it hadn't been added yet. This check ensures that it won't get added twice
                  // but there's probably a better way
                  console.log(`actually adding ${url}!!`)
                  console.log({ content })
                  const disposable = monaco.languages.typescript.typescriptDefaults.addExtraLib(
                    content,
                    url,
                  )
                  this.setState({
                    intellisenseFiles: [
                      ...this.state.intellisenseFiles,
                      { url, disposable },
                    ],
                  })
                }
              })
          })
      }

      // TODO: add logic to remove intellisense
    }
  }

  render() {
    return <div ref={this.container} style={{ width: '100%', height: '100%' }} />
  }
}

export default ReactMonaco
