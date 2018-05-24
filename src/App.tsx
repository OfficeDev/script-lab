import * as React from 'react'
import styled from 'styled-components'

import { BarButton, RunGallery, RunGalleryItem } from './components/'

const AppLayout = styled.div`
  height: 100vh;
  display: grid;

  grid-template-columns: auto;
  grid-template-rows: 44px auto 22px;
  grid-template-areas: 'header' 'content' 'footer';
`

const Header = styled.header.attrs({ className: 'ms-font-l' })`
  grid-area: header;

  display: flex;
  align-items: center;

  background: green;
`

const Content = styled.div`
  grid-area: content;

  overflow: hidden;

  background: darkgray;
`

const Footer = styled.footer`
  grid-area: footer;

  display: flex;
  align-items: center;

  background: green;
`

// =============================

// =============================

class App extends React.Component {
  render() {
    return (
      <AppLayout>
        <Header>
          <BarButton>
            <i
              className="ms-Icon ms-Icon--GlobalNavButton"
              aria-hidden="true"
            />
          </BarButton>
          <BarButton>Snippet Name</BarButton>
        </Header>
        <Content>
          <RunGallery>
            {Array.from(Array(50).keys()).map(n => (
              <RunGalleryItem label={`Snippet ${n}`}>test</RunGalleryItem>
            ))}
          </RunGallery>
        </Content>
        <Footer>Footer</Footer>
      </AppLayout>
    )
  }
}

export default App
