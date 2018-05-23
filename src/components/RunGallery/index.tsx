import * as React from 'react'
import styled from 'styled-components'

const RunGalleryItemWrapper = styled.div`
  width: 100%;
`

const RunGalleryItemLabel = styled.span`
  position: relative;
  left: 6px;
  bottom: 3px;
  margin-bottom: 4px;
`

const RunGalleryItemContentWrapper = styled.div`
  border: 1px solid gray;
  background-color: white
  box-shadow: 0px 5px 10px hsla(0, 0%, 0%, 0.15);
`

export const RunGallery = styled.main`
  overflow-y: auto;

  box-sizing: border-box;

  height: 100%;
  padding: 2% 4%;
  background-color: #ddd;

  & ${RunGalleryItemWrapper} {
    margin-bottom: 30px;
  }
`

export const RunGalleryItem = ({ label }) => (
  <RunGalleryItemWrapper>
    <RunGalleryItemLabel>{label}</RunGalleryItemLabel>
    <RunGalleryItemContentWrapper>asdf</RunGalleryItemContentWrapper>
  </RunGalleryItemWrapper>
)
