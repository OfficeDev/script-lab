import React from 'react'
import styled from 'styled-components'

export const Wrapper = styled.div`
  grid-area: editor;
  height: 100%;

  padding: 1rem 0;
`

export const Layout = styled.div`
  display: grid;
  height: 100%;
  background-color: ${props => props.theme.bg};

  grid-template-columns: auto;
  grid-template-rows: 4rem auto;
  grid-template-areas: 'command-bar' 'editor';
`
