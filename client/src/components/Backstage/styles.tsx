import React from 'react'
import styled from 'styled-components'

export const BackstageWrapper = styled.div`
  display: flex;
  flex-wrap: no-wrap;

  position: absolute;
  top: 0;
  z-index: 1000;
  background-color: ${props => props.theme.white};
  height: 100vh;
  width: 100%;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`

export const ContentWrapper = styled.main`
  flex: 1;
  padding: 1rem;
  font-size: 1.6rem;
  overflow-y: auto;
`

export const ContentTitle = styled.h1.attrs({ className: 'ms-font-xxl' })`
  margin-bottom: 2rem;
`

export const ContentDescription = styled.h2.attrs({ className: 'ms-font-l' })`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`
