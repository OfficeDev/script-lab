import React, { Component } from 'react'

import Header from '../../containers/Header'
import PivotBar from '../PivotBar'
import MessageBar from '../../containers/MessageBar'
import Editor from '../../containers/Editor'
import Footer from '../../containers/Footer'

import Backstage from '../../containers/Backstage'

import { Layout, ContentWrapper } from './styles'

const FILE_NAME_MAP = {
  'index.ts': 'Script',
  'index.html': 'HTML',
  'index.css': 'CSS',
  'libraries.txt': 'Libraries',
}

export interface IIDEPropsFromRedux {
  activeSolution: ISolution
  files: IFile[]
  activeFile: IFile
  theme: ITheme
}

export interface IIDEActionsFromRedux {
  openSolution: (solutionId: string) => void
  openFile: (solutionId: string, fileId: string) => void
}

export interface IIDE extends IIDEPropsFromRedux, IIDEActionsFromRedux {}

interface IState {
  isBackstageVisible: boolean
}

class IDE extends Component<IIDE, IState> {
  state = { isBackstageVisible: false }

  showBackstage = () => this.setState({ isBackstageVisible: true })
  hideBackstage = () => this.setState({ isBackstageVisible: false })

  componentWillReceiveProps(newProps) {
    if (!newProps.match.params.fileId) {
      this.props.openFile(newProps.activeSolution.id, newProps.activeFile.id)
    }
  }

  changeActiveFile = (fileId: string) =>
    this.props.openFile(this.props.activeSolution.id, fileId)

  render() {
    const { isBackstageVisible } = this.state
    const { activeSolution, files, activeFile, theme } = this.props
    return (
      <>
        <Layout style={{ display: isBackstageVisible ? 'none' : 'flex' }}>
          <Header
            solution={activeSolution}
            files={files}
            showBackstage={this.showBackstage}
          />
          <PivotBar
            theme={theme}
            items={files.map(file => ({
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
              activeFiles={files}
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

export default IDE
