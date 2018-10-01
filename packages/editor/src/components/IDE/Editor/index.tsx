import React, { Component } from 'react'

import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'
import { DefaultButton } from 'office-ui-fabric-react/lib/Button'

import Monaco from './Monaco'
import Only from '../../Only'
import SettingsNotAppliedDialog from './SettingsNotAppliedDialog'

import { Layout } from './styles'

import {
  SETTINGS_FILE_ID,
  SETTINGS_SOLUTION_ID,
  NULL_SOLUTION_ID,
  ABOUT_FILE_ID,
} from '../../../constants'

import {
  getModel,
  setPosForModel,
  getModelByIdIfExists,
  removeModelFromCache,
} from './Monaco/monaco-models'

import debounce from 'lodash/debounce'

import { connect } from 'react-redux'
import { withTheme } from 'styled-components'
import actions from '../../../store/actions'
import selectors from '../../../store/selectors'
import { defaultSettings } from 'src/defaultSettings'

interface IEditorSettings {
  monacoTheme: string
  fontFamily: string
  fontSize: number
  tabSize: number
  lineHeight: number
  isMinimapEnabled: boolean
  isFoldingEnabled: boolean
  isPrettierEnabled: boolean
  wordWrap: 'on' | 'off' | 'bounded' | 'wordWrapColumn'
  wordWrapColumn: number
}

interface IPropsFromRedux {
  settingsFile: IFile
  isSettingsView: boolean
  editorSettings: IEditorSettings
}

const mapStateToProps = (state, ownProps: IProps): IPropsFromRedux => ({
  settingsFile: selectors.solutions.getFile(state, SETTINGS_FILE_ID),
  isSettingsView: ownProps.activeSolution.id === SETTINGS_SOLUTION_ID,

  editorSettings: {
    monacoTheme: selectors.settings.getMonacoTheme(state),
    fontFamily: selectors.settings.getFontFamily(state),
    fontSize: selectors.settings.getFontSize(state),
    tabSize: selectors.settings.getTabSize(state),
    lineHeight: selectors.settings.getLineHeight(state),
    isMinimapEnabled: selectors.settings.getIsMinimapEnabled(state),
    isFoldingEnabled: selectors.settings.getIsFoldingEnabled(state),
    isPrettierEnabled: selectors.settings.getIsPrettierEnabled(state),
    wordWrap: selectors.settings.getWordWrap(state),
    wordWrapColumn: selectors.settings.getWordWrapColumn(state),
  },
})

interface IActionsFromRedux {
  changeActiveFile: (fileId: string) => void
  editFile: (
    solutionId: string,
    fileId: string,
    file: Partial<IEditableFileProperties>,
  ) => void
  openSettings: () => void
  editSettings: (currentSettings: IFile, newSettings: IFile) => void
  signalEditorLoaded: () => void
}

const mapDispatchToProps = (dispatch, ownProps: IProps): IActionsFromRedux => ({
  changeActiveFile: (fileId: string) =>
    dispatch(actions.editor.open({ solutionId: ownProps.activeSolution.id, fileId })),
  editFile: (
    solutionId: string,
    fileId: string,
    file: Partial<IEditableFileProperties>,
  ) => dispatch(actions.solutions.edit({ id: solutionId, fileId, file })),
  openSettings: () => dispatch(actions.settings.open()),
  editSettings: (currentSettings: IFile, newSettings: IFile) =>
    dispatch(actions.settings.editFile({ currentSettings, newSettings })),
  signalEditorLoaded: () => dispatch(actions.editor.signalHasLoaded()),
})

export interface IProps extends IPropsFromRedux, IActionsFromRedux {
  activeSolution: ISolution
  activeFiles: IFile[]
  activeFile: IFile
  isVisible: boolean

  theme: ITheme // from withTheme
}

interface IState {
  isSaveSettingsDialogVisible: boolean
}

class Editor extends Component<IProps, IState> {
  editor: monaco.editor.IStandaloneCodeEditor
  monaco: any
  state = { isSaveSettingsDialogVisible: false }
  resizeInterval: any
  resizeListener: any

  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeFile.id !== this.props.activeFile.id) {
      this.changeActiveFile(prevProps.activeFile, this.props.activeFile)
    }

    if (!prevProps.isVisible && this.props.isVisible) {
      this.resizeEditor()
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.resizeInterval)
    window.removeEventListener('resize', this.resizeListener)
  }

  changeActiveFile = (oldFile: IFile | null, newFile: IFile) => {
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

      // For some unknown reason, the editor.getAction('editor.action.format').run() did not work at this point in the code
      if (this.props.editorSettings.isPrettierEnabled) {
        this.editor.trigger('anyString', 'editor.action.formatDocument', '')
      }
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
      () => {
        editor.getAction('editor.action.format').run()
      },

      '',
    )

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_COMMA,
      this.props.openSettings,
      '',
    )

    this.changeActiveFile(null, this.props.activeFile)

    this.resizeListener = window.addEventListener(
      'resize',
      debounce(this.resizeEditor, 100),
    )

    this.props.signalEditorLoaded()
  }

  getMonacoOptions = (): monaco.editor.IEditorConstructionOptions => {
    const { editorSettings } = this.props
    const {
      fontFamily,
      fontSize,
      lineHeight,
      isMinimapEnabled,
      isFoldingEnabled,
      wordWrap,
      wordWrapColumn,
    } = editorSettings

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
      ariaLabel: 'editor',
      wordWrap,
      wordWrapColumn,
      readOnly:
        this.props.activeSolution.id === NULL_SOLUTION_ID ||
        this.props.activeFile.id === ABOUT_FILE_ID,
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

  // settings related methods
  openSettings = () => {
    this.props.openSettings()
    this.closeSaveSettingsDialog()
  }

  openSaveSettingsDialog = () => this.setState({ isSaveSettingsDialogVisible: true })
  closeSaveSettingsDialog = () => this.setState({ isSaveSettingsDialogVisible: false })

  applySettingsUpdate = () => {
    const copy = this.props.settingsFile
    copy.content = getModel(this.monaco, copy).model.getValue()
    this.props.editSettings(this.props.settingsFile, copy)
    this.closeSaveSettingsDialog()
  }

  resetSettings = () => {
    const copy = this.props.settingsFile
    copy.content = JSON.stringify(
      defaultSettings,
      null,
      this.props.editorSettings.tabSize,
    )
    this.props.editSettings(this.props.settingsFile, copy)
    getModel(this.monaco, this.props.settingsFile).model.setValue(copy.content)
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
    const {
      activeFiles,
      activeSolution,
      editorSettings,
      isSettingsView,
      theme,
    } = this.props

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
                <DefaultButton primary={true} onClick={this.applySettingsUpdate}>
                  Apply
                </DefaultButton>
                <DefaultButton onClick={this.cancelSettingsUpdate}>Cancel</DefaultButton>
                <DefaultButton onClick={this.resetSettings}>Reset</DefaultButton>
              </div>
            }
            isMultiline={false}
            styles={{ root: { backgroundColor: '#333333', color: 'white' } }}
          >
            There are changes that have affected your settings. Click Apply to accept the
            changes or you may restore back to default settings with Restore.
          </MessageBar>
        </Only>

        <SettingsNotAppliedDialog
          isHidden={!this.state.isSaveSettingsDialogVisible}
          onDismiss={this.closeSaveSettingsDialog}
          apply={this.applySettingsUpdate}
          open={this.openSettings}
          cancel={this.cancelSettingsUpdate}
        />

        <Layout style={{ backgroundColor: theme.neutralDark }}>
          <Monaco
            theme={monacoTheme}
            options={options}
            tabSize={editorSettings.tabSize}
            isPrettierEnabled={editorSettings.isPrettierEnabled}
            editorDidMount={this.setupEditor}
            libraries={libraries && libraries.content}
          />
        </Layout>
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(Editor))
