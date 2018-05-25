import * as React from 'react'
import styled, { ThemeProvider } from 'styled-components'

import { BarButton, Editor } from './components/'

const theme = {
  accent: '#217346',
  darkAccent: '#103822',
  bg: '#1e1e1e',
  fg: '#eeeeee',
}

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

  background: ${props => props.theme.accent};
`

const Content = styled.div`
  grid-area: content;

  overflow: hidden;

  background: ${props => props.theme.bg};
`

const Footer = styled.footer`
  grid-area: footer;

  display: flex;
  align-items: center;

  background: ${props => props.theme.accent};
`

// =============================

// =============================

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
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
            <Editor />
          </Content>
          <Footer>Footer</Footer>
        </AppLayout>
      </ThemeProvider>
    )
  }
}

export default App
