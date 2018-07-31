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

interface IIDE {
  solutions: ISolution[]
  activeSolution: ISolution
  files: IFile[]
  activeFile: IFile

  openSolution: (solutionId: string) => void
  openFile: (solutionId: string, fileId: string) => void
}

class IDE extends Component<IIDE> {
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
    const { solutions, activeSolution, files, activeFile } = this.props
    return (
      <>
        <Layout>
          <Header solution={activeSolution} showBackstage={this.showBackstage} />
          <PivotBar
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
              files={files}
              activeFile={activeFile}
            />
          </ContentWrapper>
          <Footer activeFile={activeFile} />
        </Layout>
        <Backstage
          solutions={solutions}
          activeSolution={activeSolution}
          isHidden={!isBackstageVisible}
          hideBackstage={this.hideBackstage}
        />
      </>
    )
  }
}

export default IDE
