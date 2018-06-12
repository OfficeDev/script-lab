import * as React from 'react'
import styled from 'styled-components'
import { NavLink, Switch, Route } from 'react-router-dom'

import { Header, Editor, Footer } from './containers'

import { StyledComponentsThemeProvider } from './theme'
import { IFile } from './stores/files'

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

// const Main = () => (
//   <Switch>
//     <Route exact={true} path="/" component={Editor} />
//     <Route exact={true} path="/backstage" component={Editor} />
//   </Switch>
// )
interface IAppProps {
  activeFile?: IFile
}

class App extends React.Component<IAppProps> {
  render() {
    return (
      <StyledComponentsThemeProvider>
        <AppLayout>
          <Header />
          <Content>{this.props.activeFile && <Editor />}</Content>
          <Footer />
        </AppLayout>
      </StyledComponentsThemeProvider>
    )
  }
}

export default App
