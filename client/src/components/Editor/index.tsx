import React, { Component } from 'react'

import debounce from 'lodash/debounce'
import prettier from 'prettier/standalone'
import prettierTypeScript from 'prettier/parser-typescript'

import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'

import { SETTINGS_FILE_ID, SETTINGS_SOLUTION_ID } from '../../constants'

import Monaco from './Monaco'
import Only from '../Only'
import { Layout } from './styles'

import { getModel, setPosForModel, getModelByIdIfExists } from './Monaco/monaco-models'

export interface IEditorSettings {
  monacoTheme: string
  fontFamily: string
  fontSize: number
  lineHeight: number
  isMinimapEnabled: boolean
  isFoldingEnabled: boolean
  isPrettierEnabled: boolean
}

export interface IEditor {
  activeSolution: ISolution
  activeFiles: IFile[]
  activeFile: IFile
  settingsFile: IFile

  isSettingsView: boolean

  editorSettings: IEditorSettings

  openSettings: () => void
  changeActiveFile: (fileId: string) => void
  editFile: (
    solutionId: string,
    fileId: string,
    file: Partial<IEditableFileProperties>,
  ) => void
  theme: any
}

interface IState {
  isSaveSettingsDialogVisible: boolean
}

class Editor extends Component<IEditor, IState> {
  editor: monaco.editor.IStandaloneCodeEditor
  monaco: any
  state = { isSaveSettingsDialogVisible: false }

  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeFile.id !== this.props.activeFile.id) {
      this.changeActiveFile(prevProps.activeFile, this.props.activeFile)
    }
  }

  changeActiveFile = (oldFile: IFile | null, newFile: IFile) => {
    console.log('active file changed')
    if (this.editor && newFile) {
      if (oldFile && oldFile.id === SETTINGS_FILE_ID && this.checkIfUnsaved(oldFile)) {
        // Open the save settings dialog if the user tries to
        // navigate away from the settings page with unsaved changes
        this.openSaveSettingsDialog()
      }

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

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_F,
      this.prettifyCode,
      '',
    )

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_COMMA,
      this.props.openSettings,
      '',
    )

    this.changeActiveFile(null, this.props.activeFile)

    window.addEventListener('resize', debounce(this.resizeEditor, 100))
  }

  getMonacoOptions = (): monaco.editor.IEditorConstructionOptions => {
    const { editorSettings } = this.props
    const {
      fontFamily,
      fontSize,
      lineHeight,
      isMinimapEnabled,
      isFoldingEnabled,
    } = editorSettings

    console.log('getting monaco options')

    return {
      selectOnLineNumbers: true,
      fontSize,
      fontFamily: [
        fontFamily,
        'Menlo',
        'Source Code Pro',
        'Consolas',
        'Courier New',
        'monospace',
      ]
        .map(fontName => (fontName.includes(' ') ? JSON.stringify(fontName) : fontName))
        .join(', '),
      minimap: { enabled: isMinimapEnabled },
      scrollbar: {
        vertical: 'visible',
        arrowSize: 15,
      },
      formatOnPaste: true,
      lineHeight,
      folding: isFoldingEnabled,
      glyphMargin: false,
      fixedOverflowWidgets: true,
      ariaLabel: 'todo',
    }
  }

  handleChange = () => {
    if (this.props.isSettingsView) {
      this.forceUpdate()
    } else {
      this.editFile()
    }
  }

  editFile = debounce(() => {
    const newValue = this.editor.getModel().getValue() || ''
    const oldValue = this.props.activeFile.content
    const copy = this.props.activeFile
    copy.content = newValue
    this.props.editFile(this.props.activeSolution.id, this.props.activeFile.id, copy)
  }, 250)

  resizeEditor = () => {
    this.forceUpdate(() => {
      this.editor.layout()
    })
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

  // settings related methods
  openSettings = () => {
    this.props.changeActiveFile(SETTINGS_FILE_ID)
    this.closeSaveSettingsDialog()
  }

  openSaveSettingsDialog = () => this.setState({ isSaveSettingsDialogVisible: true })
  closeSaveSettingsDialog = () => this.setState({ isSaveSettingsDialogVisible: false })

  applySettingsUpdate = () => {
    const copy = this.props.settingsFile
    copy.content = getModel(this.monaco, copy).model.getValue()
    this.props.editFile(SETTINGS_SOLUTION_ID, SETTINGS_FILE_ID, copy)
    this.closeSaveSettingsDialog()
  }

  cancelSettingsUpdate = () => {
    getModel(this.monaco, this.props.settingsFile).model.setValue(
      this.props.settingsFile.content,
    )
    this.closeSaveSettingsDialog()
  }

  checkIfUnsaved = (file: IFile) => {
    if (this.monaco) {
      return file.content !== getModel(this.monaco, file).model.getValue()
    }
    return false
  }

  render() {
    const { activeFiles, editorSettings, isSettingsView, theme } = this.props
    const { monacoTheme } = editorSettings
    const options = this.getMonacoOptions()
    const libraries = activeFiles.find(file => file.name === 'libraries.txt')

    return (
      <>
        <Only when={isSettingsView && this.checkIfUnsaved(this.props.activeFile)}>
          <MessageBar
            messageBarType={MessageBarType.info}
            actions={
              <div>
                {/* TODO: (nicobell) Figure out why MessageBarButtons didn't work (get
                styled properly) and if they have advantages regular buttons miss */}
                <DefaultButton primary={true} onClick={this.applySettingsUpdate}>
                  Apply
                </DefaultButton>
                <DefaultButton onClick={this.cancelSettingsUpdate}>Cancel</DefaultButton>
                <DefaultButton>Reset</DefaultButton>
              </div>
            }
            isMultiline={false}
            styles={{ root: { backgroundColor: '#333333', color: 'white' } }}
          >
            There are changes that have affected your settings. Click Apply to accept the
            changes or you may restore back to default settings with Restore.
          </MessageBar>
        </Only>

        <Dialog
          isDarkOverlay={true}
          hidden={!this.state.isSaveSettingsDialogVisible}
          onDismiss={this.closeSaveSettingsDialog}
          dialogContentProps={{
            type: DialogType.largeHeader,
            title: 'Ut Oh!',
            subText:
              "It looks like you made an edit to your settings that you didn't apply.Would you like to apply these changes ?",
          }}
          modalProps={{ isBlocking: true }}
        >
          {getModelByIdIfExists(this.monaco, SETTINGS_FILE_ID)
            ? getModelByIdIfExists(this.monaco, SETTINGS_FILE_ID)!.model.getValue()
            : 'no model ;('}
          <DialogFooter>
            <PrimaryButton text="Apply" onClick={this.applySettingsUpdate} />
            <DefaultButton text="Cancel" onClick={this.cancelSettingsUpdate} />
            <DefaultButton text="Open" onClick={this.openSettings} />
          </DialogFooter>
        </Dialog>

        <Layout style={{ backgroundColor: theme.neutralDark }}>
          <Monaco
            theme={monacoTheme}
            options={options}
            editorDidMount={this.setupEditor}
            libraries={libraries && libraries.content}
          />
        </Layout>
      </>
    )
  }
}

export default Editor
