import React from 'react'

import Header from '../../containers/Header'
import Editor from '../../containers/Editor'
import Footer from '../Footer'

import { Layout, ContentWrapper } from './styles'

// TODO: FIX manual passing of params from router
const IDE = ({ match }) => (
  <Layout>
    <Header params={match.params} />
    <ContentWrapper>
      <Editor params={match.params} foo="bar" />
    </ContentWrapper>
    <Footer language="TODO" />
  </Layout>
)

export default IDE
