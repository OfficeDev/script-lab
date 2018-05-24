import * as React from 'react'
import styled from 'styled-components'

const RunGalleryItemWrapper = styled.div``

const RunGalleryItemLabel = styled.span.attrs({ className: 'ms-font-xl' })`
  position: relative;
  left: 0.6rem;
  bottom: 0.3rem;
`

const RunGalleryItemContentWrapper = styled.div`
  min-height: 20rem;
  max-height: 30vh;
  overflow: auto;

  border: .1rem solid gray;
  background-color: white
  box-shadow: 0px .5rem 1rem hsla(0, 0%, 0%, .15);
`

export const RunGallery = styled.main`
  overflow-y: auto;

  box-sizing: border-box;

  height: 100%;
  padding: 2rem 4rem;
  background-color: #ddd;

  & ${RunGalleryItemWrapper} {
    margin-bottom: 4rem;
  }
`

export const RunGalleryItem = ({ label, children }) => (
  <RunGalleryItemWrapper>
    <RunGalleryItemLabel>{label}</RunGalleryItemLabel>
    <RunGalleryItemContentWrapper>{children}</RunGalleryItemContentWrapper>
  </RunGalleryItemWrapper>
)
