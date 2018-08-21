import React, { Component } from 'react'
import { withTheme } from 'styled-components'

import Header from '../Header'
import PivotBar from '../PivotBar'
import MessageBar from '../MessageBar'
import Editor from '../Editor'
import Footer from '../Footer'

import Backstage from '../Backstage'

import { Layout, ContentWrapper } from './styles'
import { NULL_SOLUTION, NULL_FILE, NULL_FILE_ID, NULL_SOLUTION_ID } from '../../constants'
import Only from '../Only'

import { connect } from 'react-redux'
import selectors from '../../store/selectors'
import { push } from 'connected-react-router'

const FILE_NAME_MAP = {
  'index.ts': 'Script',
  'index.html': 'HTML',
  'index.css': 'CSS',
  'libraries.txt': 'Libraries',
}

interface IPropsFromRedux {
  activeSolution: ISolution
  activeFile: IFile
}

const mapStateToProps = (state): Partial<IPropsFromRedux> => ({
  activeSolution: selectors.solutions.getActive(state),
  activeFile: selectors.solutions.getActiveFile(state),
})

interface IActionsFromRedux {
  openSolution: (solutionId: string) => void
  openFile: (solutionId: string, fileId: string) => void
}

const mapDispatchToProps = (dispatch): IActionsFromRedux => ({
  openSolution: (solutionId: string) => dispatch(push(`/${solutionId}`)),
  openFile: (solutionId: string, fileId: string) =>
    dispatch(push(`/${solutionId}/${fileId}`)),
})

export interface IIDE extends IPropsFromRedux, IActionsFromRedux {
  theme: ITheme // from withTheme
}

interface IState {
  isBackstageVisible: boolean
}

class IDE extends Component<IIDE, IState> {
  state = { isBackstageVisible: false }

  static defaultProps: Partial<IIDE> = {
    activeSolution: NULL_SOLUTION,
    activeFile: NULL_FILE,
  }

  showBackstage = () => this.setState({ isBackstageVisible: true })
  hideBackstage = () => this.setState({ isBackstageVisible: false })

  componentWillReceiveProps(newProps) {
    if (!newProps.match.params.fileId && newProps.activeFile.id !== NULL_FILE_ID) {
      this.props.openFile(newProps.activeSolution.id, newProps.activeFile.id)
    }
  }

  changeActiveFile = (fileId: string) =>
    this.props.openFile(this.props.activeSolution.id, fileId)

  render() {
    const { isBackstageVisible } = this.state
    const { activeSolution, activeFile, theme } = this.props
    return (
      <>
        <Layout style={{ display: isBackstageVisible ? 'none' : 'flex' }}>
          <Header solution={activeSolution} showBackstage={this.showBackstage} />
          <PivotBar
            theme={theme}
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
            />
          </ContentWrapper>
          <Footer activeFile={activeFile} />
        </Layout>
        <Backstage
          activeSolution={activeSolution}
          isHidden={!isBackstageVisible}
          hideBackstage={this.hideBackstage}
        />
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(IDE))
