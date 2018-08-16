import React from 'react'
import styled from 'styled-components'

export const GalleryListWrapper = styled.section`
  margin: 1.2rem 0;

  &:focus {
    outline-color: ${props => props.theme.primary};
  }
`

// TODO: decide on convention here: GalleryListWrapper vs Wrapper
export const TitleBar = styled.div.attrs({ className: 'ms-font-m' })`
  display: flex;
  height: 4rem;
  color: ${props => props.theme.neutralDark};
  background-color: ${props => props.theme.neutralLight};
  white-space: nowrap;
  overflow: hidden;
`

export const Title = styled.span`
  padding: 1.2rem;
  flex: 1;
`

// TODO: really realllly refactor those styles out soon
export const ArrowWrapper = styled.div`
  padding: 1.2rem;

  &:hover, &:focus {
    background-color: ${props => props.theme.primary}
    color: ${props => props.theme.white}
    cursor: pointer;
  }
`
