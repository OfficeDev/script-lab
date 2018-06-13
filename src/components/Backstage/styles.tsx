import React from 'react'
import styled from 'styled-components'

export const BackstageWrapper = styled.div`
  display: flex;
  flex-wrap: no-wrap;

  height: 100vh;
`

export const NavMenu = styled.ul`
  display: flex;
  flex-direction: column;

  height: 100vh;
  width: 20rem;

  background-color: ${props => props.theme.accent};
  color: ${props => props.theme.fg};
`

export const NavMenuItem = styled.li`
  display: flex;
  align-items: center;

  height: 7rem;
  padding: 2rem 3rem;

  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.2);
  }
  &:active {
    background: rgba(0, 0, 0, 0.4);
  }
`

export const ContentWrapper = styled.main`
  flex: 1;
  background: papayawhip;
  padding: 1rem;
  font-size: 1.6rem;
`
