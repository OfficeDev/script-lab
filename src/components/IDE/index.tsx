import React, { Component } from 'react'

import Header from '../../containers/Header'
import Editor from '../../containers/Editor'
import Footer from '../../containers/Footer'

import Backstage from '../../containers/Backstage'

import { Layout, ContentWrapper } from './styles'

interface IIDE {
  match: any // TODO: what is it's type?
}

class IDE extends Component<IIDE> {
  state = { isBackstageVisible: false }

  showBackstage = () => this.setState({ isBackstageVisible: true })
  hideBackstage = () => this.setState({ isBackstageVisible: false })

  render() {
    // TODO: FIX manual passing of params from router
    const { isBackstageVisible } = this.state

    const params = this.props.match.params
    return (
      <>
        <Layout>
          <Header params={params} showBackstage={this.showBackstage} />
          <ContentWrapper>
            <Editor params={params} />
          </ContentWrapper>
          <Footer params={params} />
        </Layout>
        <Backstage
          params={params}
          isHidden={!isBackstageVisible}
          hideBackstage={this.hideBackstage}
        />
      </>
    )
  }
}

export default IDE
