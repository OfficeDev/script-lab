import React from 'react'
import styled from 'styled-components'

export const Layout = styled.div`
  height: 100vh;
  display: grid;

  grid-template-columns: auto;
  grid-template-rows: 4rem auto 2rem;
  grid-template-areas: 'header' 'content' 'footer';
`

export const ContentWrapper = styled.div`
  grid-area: content;

  overflow: hidden;

  background: ${props => props.theme.bg};
`
