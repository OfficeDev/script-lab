import * as React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { NavLink, Switch, Route } from 'react-router-dom'

import { BarButton } from './components/'

import { Editor } from './containers'

import UserPresence from './components/UserPresence'

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
  grid-template-rows: 4.4rem auto 2.2rem;
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

const Blank = styled.div`
  height: 100%;
  background: pink;
`

const StyledIcon = styled.i`
  height: 100%;
  color: white;
`
// =============================

// =============================

const Main = () => (
  <Switch>
    <Route exact={true} path="/" component={Editor} />
    <Route exact={true} path="/backstage" component={Blank} />
  </Switch>
)

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
            <UserPresence />
          </Header>
          <Content>
            <Main />
          </Content>
          <Footer>Footer</Footer>
        </AppLayout>
      </ThemeProvider>
    )
  }
}

export default App
