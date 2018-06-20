import React from 'react'

import Header from '../../containers/Header'
import Editor from '../../containers/Editor'
import Footer from '../../containers/Footer'

import { Layout, ContentWrapper } from './styles'

const App = () => (
  <Layout>
    <Header />
    <ContentWrapper>
      <Editor />
    </ContentWrapper>
    <Footer />
  </Layout>
)

export default App
