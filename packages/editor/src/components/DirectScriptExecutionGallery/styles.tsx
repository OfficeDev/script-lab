import styled from 'styled-components'

export const RunGalleryItemWrapper = styled.div``

export const RunGalleryItemLabel = styled.span.attrs({ className: 'ms-font-xl' })`
  position: relative;
  left: 0.6rem;
  bottom: 0.3rem;
`

export const RunGalleryItemContentWrapper = styled.div`
  min-height: 20rem;
  /* max-height: 30vh; */
  overflow: auto;
  padding: 2rem;
  border: 0.1rem solid gray;
  box-sizing: border-box;
  background-color: white;
  box-shadow: 0px 0.5rem 1rem hsla(0, 0%, 0%, 0.15);
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
