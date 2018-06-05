import React from 'react'
import styled from 'styled-components'

import { BarButton } from '../'

const FooterWrapper = styled.footer`
  grid-area: footer;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  font-size: 1.2rem;

  background-color: ${props => props.theme.accent};
  color: ${props => props.theme.fg};
`

const Footer = ({ language }) => (
  <FooterWrapper>
    <BarButton>{language}</BarButton>
  </FooterWrapper>
)

export default Footer
