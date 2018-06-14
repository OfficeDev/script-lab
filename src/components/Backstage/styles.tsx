import React from 'react'
import styled from 'styled-components'

import { Pivot, PivotItem } from '../Pivot'

export const BackstageWrapper = styled.div`
  display: flex;
  flex-wrap: no-wrap;

  height: 100vh;
`

export const NavMenu = Pivot.extend`
  display: flex;
  flex-direction: column;

  background-color: ${props => props.theme.accent};

  height: 100vh;
  width: 20rem;
`

export const NavMenuItem = styled(PivotItem)`
  display: flex;
  align-items: center;

  border: 0;

  height: 7rem;
  padding: 2rem 3rem;

  & > i {
    margin-right: 0.6rem;
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
