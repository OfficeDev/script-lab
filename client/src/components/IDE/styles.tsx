import React from 'react'
import styled from 'styled-components'

export const Layout = styled.div`
  height: 100vh;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 1000;
`

export const ContentWrapper = styled.div`
  flex: 1;

  overflow: hidden;

  background: ${props => props.theme.neutralDark};
`
