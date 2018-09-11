import React, { Component } from 'react'

import Header from './Header'
import PivotBar from '../PivotBar'
import MessageBar from './MessageBar'
import Editor from './Editor'
import Footer from './Footer'

import { Layout, ContentWrapper } from './styles'
import { NULL_SOLUTION, NULL_FILE } from '../../constants'

import { connect } from 'react-redux'
import { IState as IReduxState } from '../../store/reducer'
import selectors from '../../store/selectors'
import { editor as editorActions } from '../../store/actions'

const FILE_NAME_MAP = {
  'index.ts': 'Script',
  'index.html': 'HTML',
  'index.css': 'CSS',
  'libraries.txt': 'Libraries',
}

interface IPropsFromRedux {
  isVisible: boolean
  activeSolution: ISolution
  activeFile: IFile
}

const mapStateToProps = (state: IReduxState): Partial<IPropsFromRedux> => ({
  isVisible: state.editor.isVisible,
  activeSolution: selectors.editor.getActiveSolution(state),
  activeFile: selectors.editor.getActiveFile(state),
})

interface IActionsFromRedux {
  openFile: (solutionId: string, fileId: string) => void
}

const mapDispatchToProps = (dispatch): IActionsFromRedux => ({
  openFile: (solutionId: string, fileId: string) =>
    dispatch(editorActions.open({ solutionId, fileId })),
})

export interface IIDE extends IPropsFromRedux, IActionsFromRedux {}

class IDE extends Component<IIDE> {
  static defaultProps: Partial<IIDE> = {
    activeSolution: NULL_SOLUTION,
    activeFile: NULL_FILE,
  }

  changeActiveFile = (fileId: string) =>
    this.props.openFile(this.props.activeSolution.id, fileId)

  render() {
    const { isVisible, activeSolution, activeFile } = this.props
    return (
      <Layout style={{ display: isVisible ? 'flex' : 'none' }}>
        <Header solution={activeSolution} />
        <PivotBar
          items={activeSolution.files.map(file => ({
            key: file.id,
            text: FILE_NAME_MAP[file.name] || file.name,
          }))}
          selectedKey={activeFile.id}
          onSelect={this.changeActiveFile}
        />
        <MessageBar />
        <ContentWrapper>
          <Editor
            activeSolution={activeSolution}
            activeFiles={activeSolution.files}
            activeFile={activeFile}
            isVisible={isVisible}
          />
        </ContentWrapper>
        <Footer />
      </Layout>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IDE)
