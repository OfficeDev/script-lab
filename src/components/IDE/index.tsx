import React, { Component } from 'react'

import Header from '../../containers/Header'
import Editor from '../../containers/Editor'
import Footer from '../../containers/Footer'

import Backstage from '../../containers/Backstage'

import { Layout, ContentWrapper } from './styles'

interface IIDE {
  solutions: ISolution[]
  activeSolution: ISolution
  files: IFile[]
  activeFile: IFile

  openSolution: (solutionId: string) => void
  openFile: (fileId: string) => void
}

class IDE extends Component<IIDE> {
  state = { isBackstageVisible: false }

  showBackstage = () => this.setState({ isBackstageVisible: true })
  hideBackstage = () => this.setState({ isBackstageVisible: false })

  componentWillReceiveProps(newProps) {
    if (!newProps.match.params.solutionId) {
      this.props.openSolution(newProps.activeSolution.id)
    }

    if (!newProps.match.params.fileId) {
      this.props.openFile(newProps.activeFile.id)
    }
  }

  render() {
    // TODO: FIX manual passing of params from router
    const { isBackstageVisible } = this.state
    const { solutions, activeSolution, files, activeFile } = this.props
    return (
      <>
        <Layout>
          <Header solution={activeSolution} showBackstage={this.showBackstage} />
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
