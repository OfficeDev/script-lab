import * as React from 'react'
import styled from 'styled-components'
import { NavLink, Switch, Route } from 'react-router-dom'

import { Header, Editor, Footer, Backstage } from './containers'

import { StyledComponentsThemeProvider } from './theme'
import { IFile } from './stores/files'
import { getIsBackstageVisible } from './stores/ui'

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

  // from redux
  isBackstageVisible: boolean
  showBackstage: () => void
  hideBackstage: () => void
}

class App extends React.Component<IAppProps> {
  render() {
    const { isBackstageVisible, showBackstage, hideBackstage } = this.props
    return (
      <StyledComponentsThemeProvider>
        <>
          <AppLayout>
            <Header showBackstage={showBackstage} />
            <Content>{this.props.activeFile && <Editor />}</Content>
            <Footer />
          </AppLayout>
          <Backstage isHidden={!isBackstageVisible} hideBackstage={hideBackstage} />
        </>
      </StyledComponentsThemeProvider>
    )
  }
}

export default App
