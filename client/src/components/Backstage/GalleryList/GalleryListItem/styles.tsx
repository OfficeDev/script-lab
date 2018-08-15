import React from 'react'
import styled from 'styled-components'

export const Wrapper = styled.article.attrs({ className: 'ms-font-m' })`
  padding: 1rem 1.5rem;
  user-select: none;

  &:hover,
  &:focus {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.white};
    cursor: pointer;
  }
`

export const ActiveWrapper = Wrapper.extend`
  background-color: ${props => props.theme.primaryDarker};
  color: ${props => props.theme.white};
`

// TODO: refactor css into theme
export const Title = styled.div``

export const Description = styled.div`
  opacity: 0.75;
`
