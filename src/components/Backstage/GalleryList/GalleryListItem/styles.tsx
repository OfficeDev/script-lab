import React from 'react'
import styled from 'styled-components'

export const Wrapper = styled.article.attrs({ className: 'ms-font-m' })`
  padding: 1rem 1.5rem;

  &:hover {
    background-color: ${props => props.theme.accent}
    color: ${props => props.theme.fg}
    cursor: pointer;
  }
`

// TODO: refactor css into theme
export const Title = styled.div``

export const Description = styled.div`
  opacity: 0.6;
`
