import * as React from 'react'
import styled from 'styled-components'
import { NavLink, Switch, Route } from 'react-router-dom'

import { Header, Editor, Footer } from './containers'

import { StyledComponentsThemeProvider } from './theme'
import { IFile } from './stores/files'
import { Backstage } from './components'

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

interface IState {
  isBackstageVisible: boolean
}

class App extends React.Component<IAppProps, IState> {
  state = { isBackstageVisible: false }

  showBackstage = () => this.setState({ isBackstageVisible: true })
  hideBackstage = () => this.setState({ isBackstageVisible: false })

  render() {
    const { isBackstageVisible } = this.state
    return (
      <StyledComponentsThemeProvider>
        <>
          <AppLayout>
            <Header showBackstage={this.showBackstage} />
            <Content>{this.props.activeFile && <Editor />}</Content>
            <Footer />
          </AppLayout>
          <Backstage isHidden={!isBackstageVisible} hideBackstage={this.hideBackstage} />
        </>
      </StyledComponentsThemeProvider>
    )
  }
}

export default App
