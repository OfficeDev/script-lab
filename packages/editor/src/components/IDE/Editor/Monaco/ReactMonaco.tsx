import React, { Component } from 'react'
import prettier from 'prettier/standalone'
import isEqual from 'lodash/isEqual'
import { setOptions } from './monaco-models'

import librariesIntellisenseJSON from './libraryIntellisense'
import { schema as SettingsSchema } from '../../../../settings'
import { SETTINGS_FILE_ID } from '../../../../constants'
interface IDisposableFile {
  url: string
  disposable: monaco.IDisposable
}

const Regex = {
  STARTS_WITH_TYPINGS: /^.types\/.+|^dt~.+/i,
  STARTS_WITH_COMMENT: /^#.*|^\/\/.*|^\/\*.*|.*\*\/$.*/im,
  ENDS_WITH_CSS: /.*\.css$/i,
  ENDS_WITH_DTS: /.*\.d\.ts$/i,
  GLOBAL: /^.*/i,
}

function parse(libraries: string): string[] {
  return libraries
    .split('\n')
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

interface IProps {
  theme: string
  options: monaco.editor.IEditorConstructionOptions
  tabSize: number
  isPrettierEnabled: boolean
  editorDidMount: (editor, monaco) => void
  libraries?: string
}

interface IState {
  intellisenseFiles: IDisposableFile[]
}

class ReactMonaco extends Component<IProps, IState> {
  state = { intellisenseFiles: [] as IDisposableFile[] }
  container: React.RefObject<HTMLDivElement>
  editor: monaco.editor.IEditor
  value: string
  pauseCallingOnChange: boolean
  cachedLibraries: any

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

  async componentWillUnmount() {
    await this.deinitializeMonaco()
  }

  async componentDidUpdate(prevProps: IProps, prevState) {
    if (prevProps.libraries !== this.props.libraries) {
      this.updateIntellisense()
    }

    const win = window as any
    if (win.monaco && prevProps.theme !== this.props.theme) {
      monaco.editor.setTheme(this.props.theme)
    }

    if (this.editor && !isEqual(prevProps.options, this.props.options)) {
      this.editor.updateOptions(this.props.options)
    }

    if (prevProps.tabSize !== this.props.tabSize) {
      setOptions({ tabSize: this.props.tabSize })
    }
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

      monaco.languages.register({ id: 'libraries' })
      monaco.languages.setMonarchTokensProvider('libraries', {
        tokenizer: {
          root: [
            { regex: Regex.STARTS_WITH_COMMENT, action: { token: 'comment' } },
            { regex: Regex.ENDS_WITH_CSS, action: { token: 'number' } },
            { regex: Regex.STARTS_WITH_TYPINGS, action: { token: 'string' } },
            { regex: Regex.ENDS_WITH_DTS, action: { token: 'string' } },
            { regex: Regex.GLOBAL, action: { token: 'keyword' } },
          ],
        },
        tokenPostfix: '',
      })

      monaco.languages.registerCompletionItemProvider('libraries', {
        provideCompletionItems: (model, position) => {
          const currentLine = model.getValueInRange({
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: 1,
            endColumn: position.column,
          })

          if (Regex.STARTS_WITH_COMMENT.test(currentLine)) {
            return []
          }

          if (currentLine === '') {
            return this.libraries
          }

          return Promise.resolve([])
        },
      })

      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: SettingsSchema.$id,
            fileMatch: [
              new monaco.Uri()
                .with({
                  scheme: 'file',
                  path: SETTINGS_FILE_ID,
                })
                .toString(),
            ],
            schema: SettingsSchema,
          },
        ],
      })

      if (this.props.isPrettierEnabled) {
        import('prettier/parser-typescript').then(prettierTypeScript => {
          /* Adds Prettier Formatting to Monaco for TypeScript */
          const PrettierTypeScriptFormatter: monaco.languages.DocumentFormattingEditProvider = {
            provideDocumentFormattingEdits: (
              document: monaco.editor.ITextModel,
              options: monaco.languages.FormattingOptions,
              token: monaco.CancellationToken,
            ): monaco.languages.TextEdit[] => {
              const text = document.getValue()
              const formatted = prettier.format(text, {
                parser: 'typescript',
                plugins: [prettierTypeScript],
              })

              return [
                {
                  range: document.getFullModelRange(),
                  text: formatted,
                },
              ]
            },
          }

          monaco.languages.registerDocumentFormattingEditProvider(
            'typescript',
            PrettierTypeScriptFormatter,
          )
        })
      }

      setOptions({ tabSize: this.props.tabSize })
      this.editorDidMount(this.editor, monaco)
      this.updateIntellisense()
    }
  }

  deinitializeMonaco = async () => {
    this.state.intellisenseFiles.forEach(({ disposable }) => disposable.dispose())

    if (this.editor) {
      const disposePromise = new Promise(resolve =>
        this.editor.onDidDispose(() => resolve()),
      )
      this.editor.dispose()
      await disposePromise
    }

    this.setState({ intellisenseFiles: [] })
  }

  updateIntellisense() {
    const win = window as any
    if (this.container.current && win.monaco) {
      const oldLibs = this.state.intellisenseFiles.map(file => file.url)
      const newLibs = this.props.libraries
      if (
        newLibs &&
        !(oldLibs.length === newLibs.length && oldLibs.every((v, i) => v === newLibs[i]))
      ) {
        const oldIntellisenseFiles = this.state.intellisenseFiles
        const newIntellisenseUrls = parse(newLibs)

        const filesToDispose = this.state.intellisenseFiles.filter(
          ({ url }) => !newIntellisenseUrls.includes(url),
        )
        filesToDispose.forEach(({ disposable }) => disposable.dispose())

        const newIntellisensePromises: Array<
          Promise<IDisposableFile>
        > = newIntellisenseUrls
          .filter(url => !oldIntellisenseFiles.find(file => file.url === url))
          .map(url =>
            fetch(url)
              .then(response => response.text())
              .then(content => {
                const disposable = monaco.languages.typescript.typescriptDefaults.addExtraLib(
                  content,
                  url,
                )
                return { url, disposable }
              }),
          )
        Promise.all(newIntellisensePromises).then(newFiles => {
          const newIntellisenseFiles = this.state.intellisenseFiles
            .filter(({ url }) => newIntellisenseUrls.includes(url))
            .concat(newFiles)

          this.setState({ intellisenseFiles: newIntellisenseFiles })
        })
      }
    }
  }

  get libraries() {
    if (!this.cachedLibraries) {
      this.cachedLibraries = this.loadLibrariesIntellisense()
    }

    return this.cachedLibraries
  }

  loadLibrariesIntellisense = () => {
    return librariesIntellisenseJSON.map(library => {
      let insertText = ''

      if (Array.isArray(library.value)) {
        insertText += library.value.join('\n')
      } else {
        insertText += library.value || ''
        insertText += '\n'
      }

      if (Array.isArray(library.typings)) {
        insertText += (library.typings as string[]).join('\n')
      } else {
        insertText += library.typings || ''
        insertText += '\n'
      }

      return {
        label: library.label,
        documentation: library.description,
        kind: monaco.languages.CompletionItemKind.Module,
        insertText,
      }
    })
  }

  render() {
    return (
      <div ref={this.container} style={{ width: '100%', height: '100%' }} role="main" />
    )
  }
}

export default ReactMonaco
