import React from 'react'
import styled from 'styled-components'

export const Wrapper = styled.footer`
  /* display: flex;
  align-items: center;
  justify-content: flex-end; */
  overflow: hidden;
  height: 2rem;
  font-size: 1.2rem;

  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.white};
`
