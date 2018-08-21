import React from 'react'
import styled from 'styled-components'
import FabricIcon from '../FabricIcon'
import Only from '../Only'

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const Header = styled.header`
  display: flex;
  align-items: center;

  height: 4rem;

  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.white};

  & > :first-child {
    padding-left: 1rem;
  }
`

const Content = styled.main`
  flex: 1;
  overflow: hidden;

  padding: 1rem;
`

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;

  height: 3rem;
  line-height: 3rem;

  background-color: ${props => props.theme.neutralLight};
`

const ShowConsoleButton = styled.button`
  display: flex;
  align-items: center;

  background-color: rgba(0, 0, 0, 0);
  border: none;

  height: 100%;

  padding-left: 1rem;
  padding-right: 1rem;

  outline-color: ${props => props.theme.primary};

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  & > span {
    padding-right: 1rem;
  }
`

const HideConsoleButton = styled.button`
  position: relative;
  background-color: rgba(0, 0, 0, 0);
  color: ${props => props.theme.white};
  border: none;

  height: 100%;

  padding-left: 1rem;
  padding-right: 1rem;

  outline-color: ${props => props.theme.white};

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`

interface IState {
  isConsoleVisible: boolean
}

class CustomFunctionsDashboard extends React.Component<{}, IState> {
  state = { isConsoleVisible: false }

  hideConsole = () => this.setState({ isConsoleVisible: false })
  showConsole = () => this.setState({ isConsoleVisible: true })

  render() {
    const { isConsoleVisible } = this.state
    const title = isConsoleVisible ? 'Console' : 'Custom Functions (Preview)'

    return (
      <Layout>
        <Header>
          <Only when={isConsoleVisible}>
            <HideConsoleButton onClick={this.hideConsole}>
              <FabricIcon
                style={{
                  position: 'relative',
                  top: '5rem',
                }}
                name="Back"
              />
            </HideConsoleButton>
          </Only>
          <h1 className="ms-font-xl">{title}</h1>
        </Header>
        <Content>main</Content>
        <Only when={!isConsoleVisible}>
          <Footer>
            <ShowConsoleButton onClick={this.showConsole}>
              <span>Console</span>
              <FabricIcon name="ChevronUp" />
            </ShowConsoleButton>
          </Footer>
        </Only>
      </Layout>
    )
  }
}
export default CustomFunctionsDashboard
