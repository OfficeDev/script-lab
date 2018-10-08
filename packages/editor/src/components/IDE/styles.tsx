import React from 'react'
import styled from 'styled-components'

export const Layout = styled.div`
  height: 100vh;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  opacity: 1;

  transition: visibility 0s, opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`

export const ContentWrapper = styled.div`
  z-index: 1000;
  flex: 1;

  overflow: hidden;

  background: ${props => props.theme.neutralDark};
`
