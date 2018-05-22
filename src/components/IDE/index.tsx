import * as React from 'react'

import Layout from './Layout'
import Header from './Header'
import Editor from './Editor'
import Footer from './Footer'

export default class extends React.Component {
  state = {}
  render() {
    return (
      <Layout>
        <Header style={{ gridArea: 'header' }} />
        <Editor style={{ gridArea: 'editor' }} />
        <Footer style={{ gridArea: 'footer' }} />
      </Layout>
    )
  }
}
