import React, { Component } from 'react'
import { Layout } from './styles'
import ReactMonaco from './ReactMonaco'

import { connect } from 'react-redux'
import { actions, selectors } from '../../../store'

interface IPropsFromRedux {
  backgroundColor: string

  activeSolution: ISolution
  activeFile: IFile
}

const mapStateToProps = state => ({
  backgroundColor: selectors.settings.getBackgroundColor(state),
})

interface IActionsFromRedux {
  editFile: (
    solutionId: string,
    fileId: string,
    file: Partial<IEditableFileProperties>,
  ) => void
  signalEditorLoaded: () => void
}

const mapDispatchToProps = dispatch => ({
  editFile: (
    solutionId: string,
    fileId: string,
    file: Partial<IEditableFileProperties>,
  ) => dispatch(actions.solutions.edit({ id: solutionId, fileId, file })),
  signalEditorLoaded: (editor: any) => dispatch(actions.editor.onMount(editor)),
})

export interface IProps extends IPropsFromRedux, IActionsFromRedux {}

export class Editor extends Component<IProps> {
  onValueChange = (solutionId: string, fileId: string, content: string) =>
    this.props.editFile(solutionId, fileId, { content })

  render() {
    const { backgroundColor } = this.props

    return (
      <Layout style={{ backgroundColor }}>
        <ReactMonaco
          solutionId={this.props.activeSolution.id}
          file={this.props.activeFile}
          onValueChange={this.onValueChange}
          editorDidMount={this.props.signalEditorLoaded}
        />
      </Layout>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Editor)
