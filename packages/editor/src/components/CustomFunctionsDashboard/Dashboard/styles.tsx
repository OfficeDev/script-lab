import styled from 'styled-components'

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

export const Header = styled.header`
  box-shadow: 0px 2px 5px 2px ${props => props.theme.neutralSecondary};
  z-index: 1000;
`

export const Content = styled.div`
  flex: 1;
  overflow: hidden;
  z-index: 999;

  background-color: ${props => props.theme.white};
`
