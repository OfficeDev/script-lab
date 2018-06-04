import * as React from 'react'
import styled from 'styled-components'
import { NavLink, Switch, Route } from 'react-router-dom'

import { Header, Editor, Footer } from './containers'

import { StyledComponentsThemeProvider } from './theme'

const AppLayout = styled.div`
  height: 100vh;
  display: grid;

  grid-template-columns: auto;
  grid-template-rows: 4rem auto 2rem;
  grid-template-areas: 'header' 'content' 'footer';
`

const Content = styled.div`
  grid-area: content;

  overflow: hidden;

  background: ${props => props.theme.bg};
`

const Main = () => (
  <Switch>
    <Route exact={true} path="/" component={Editor} />
    <Route exact={true} path="/backstage" component={Editor} />
  </Switch>
)

class App extends React.Component {
  render() {
    return (
      <StyledComponentsThemeProvider>
        <AppLayout>
          <Header />
          <Content>
            <Main />
          </Content>
          <Footer />
        </AppLayout>
      </StyledComponentsThemeProvider>
    )
  }
}

export default App
