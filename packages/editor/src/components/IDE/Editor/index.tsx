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
import { defaultSettings } from '../../../settings'

interface IEditorSettings {
  monacoTheme: string
  fontFamily: string
  fontSize: number
  tabSize: number
  isMinimapEnabled: boolean
  isFoldingEnabled: boolean
  isPrettierEnabled: boolean
  isAutoFormatEnabled: boolean
  wordWrap: 'on' | 'off' | 'bounded'
}

interface IPropsFromRedux {
  settingsFile: IFile
  isSettingsView: boolean
  backgroundColor: string
  editorSettings: IEditorSettings
}

const mapStateToProps = (state, ownProps: IProps): IPropsFromRedux => ({
  settingsFile: selectors.solutions.getFile(state, SETTINGS_FILE_ID),
  isSettingsView: ownProps.activeSolution.id === SETTINGS_SOLUTION_ID,
  backgroundColor: selectors.settings.getBackgroundColor(state),
  editorSettings: {
    monacoTheme: selectors.settings.getMonacoTheme(state),
    fontFamily: selectors.settings.getFontFamily(state),
    fontSize: selectors.settings.getFontSize(state),
    tabSize: selectors.settings.getTabSize(state),
    isMinimapEnabled: selectors.settings.getIsMinimapEnabled(state),
    isFoldingEnabled: selectors.settings.getIsFoldingEnabled(state),
    isPrettierEnabled: selectors.settings.getIsPrettierEnabled(state),
    isAutoFormatEnabled: selectors.settings.getIsAutoFormatEnabled(state),
    wordWrap: selectors.settings.getWordWrap(state),
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
  editSettings: (newSettings: string) => void
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
  editSettings: (newSettings: string) =>
    dispatch(actions.settings.editFile({ newSettings, showMessageBar: true })),
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
      if (
        this.props.editorSettings.isPrettierEnabled &&
        this.props.editorSettings.isAutoFormatEnabled &&
        newFile.id !== SETTINGS_FILE_ID
      ) {
        this.editor.trigger(
          'editor' /* source, unused */,
          'editor.action.formatDocument',
          '',
        )
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

    editor.addAction({
      id: 'trigger-suggest',
      label: 'Trigger suggestion',
      keybindings: [monaco.KeyCode.F2],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 0 /* put at top of context menu */,
      run: () =>
        editor.trigger('editor' /* source, unused */, 'editor.action.triggerSuggest', {}),
    })

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
      isMinimapEnabled,
      isFoldingEnabled,
      wordWrap,
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
      lineHeight: fontSize * 1.35,
      folding: isFoldingEnabled,
      glyphMargin: false,
      fixedOverflowWidgets: true,
      ariaLabel: 'editor',
      wordWrap,
      wordWrapColumn: 120,
      wrappingIndent: 'indent',
      readOnly:
        this.props.activeSolution.id === NULL_SOLUTION_ID ||
        this.props.activeFile.id === ABOUT_FILE_ID,
      lineNumbers: this.props.activeFile.id !== ABOUT_FILE_ID ? 'on' : 'off',
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
    this.props.editSettings(
      getModel(this.monaco, this.props.settingsFile).model.getValue(),
    )
    this.closeSaveSettingsDialog()
  }

  resetSettings = () => {
    const newSettings = JSON.stringify(
      defaultSettings,
      null,
      this.props.editorSettings.tabSize,
    )

    this.props.editSettings(newSettings)

    getModel(this.monaco, this.props.settingsFile).model.setValue(newSettings)
  }

  cancelSettingsUpdate = () => {
    getModel(this.monaco, this.props.settingsFile).model.setValue(
      this.props.settingsFile.content,
    )
    this.closeSaveSettingsDialog()
  }

  checkIfUnsaved = (file: IFile) => {
    if (this.monaco) {
      return (
        file.content.trim() !==
        getModel(this.monaco, file)
          .model.getValue()
          .trim()
      )
    }
    return false
  }

  render() {
    const {
      activeFiles,
      activeSolution,
      backgroundColor,
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

        <Layout style={{ backgroundColor }}>
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
