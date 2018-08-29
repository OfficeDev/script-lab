import styled from 'styled-components'

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`
export const Header = styled.header`
  box-shadow: 0px 2px 5px 2px ${props => props.theme.neutralSecondary};
`
export const Content = styled.main`
  flex: 1;
  overflow: hidden;
`
