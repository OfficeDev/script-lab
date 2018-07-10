import React from 'react'
import styled from 'styled-components'

// import { Pivot, PivotItem } from '../Pivot'

export const BackstageWrapper = styled.div`
  display: flex;
  flex-wrap: no-wrap;

  position: absolute;
  top: 0;
  z-index: 1000;
  /* TODO: use theme */
  background-color: white;
  height: 100vh;
  width: 100%;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`

// export const NavMenu = Pivot.extend`
export const NavMenu = styled.div`
  display: flex;
  background-color: ${props => props.theme.accent};
  white-space: nowrap;
  overflow: hidden;

  flex-direction: column;
  height: 100vh;
  width: 20rem;

  @media (max-width: 500px) {
    flex-direction: row;
    height: 4rem;
    width: 100%;
  }
`

// export const NavMenuItem = styled(PivotItem)`
export const NavMenuItem = styled('div')`
  display: flex;
  align-items: center;

  border: 0;

  height: 7rem;
  padding: 2rem 3rem;

  @media (max-width: 500px) {
    height: 100%;
    padding: 1rem 1.5rem;

    & > span {
      display: none;
    }
  }

  & > i {
    margin-right: 1rem;
  }

  & > i:last-child {
    margin-right: 0;
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
  margin-bottom: 3rem;
`
