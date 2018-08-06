import React from 'react'
import styled from 'styled-components'

export const Wrapper = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 2rem;
  font-size: 1.2rem;

  background-color: ${props => props.theme.accent};
  color: ${props => props.theme.fg};
`
