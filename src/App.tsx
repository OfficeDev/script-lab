import * as React from 'react'
import styled from 'styled-components'

import { Bar } from './components/'

const AppLayout = styled.div`
  height: 100vh;
  display: grid;

  grid-template-columns: auto;
  grid-template-rows: 44px auto 22px;
  grid-template-areas: 'header' 'content' 'footer';
`

const Header = styled(Bar)`
  grid-area: header;

  background: green;
`

const Content = styled.div`
  grid-area: content;

  background: darkgray;
`

const Footer = styled(Bar)`
  grid-area: footer;

  background: green;
`

// =============================

const RunGalleryWrapper = styled.main`
  overflow-y: auto;

  height: 100%;
  background-color: red;
`

// =============================

class App extends React.Component {
  render() {
    return (
      <AppLayout>
        <Header>Header</Header>
        <Content>
          <RunGalleryWrapper />
        </Content>
        <Footer>Footer</Footer>
      </AppLayout>
    )
  }
}

export default App
