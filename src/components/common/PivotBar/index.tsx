import * as React from 'react'
import styled from 'styled-components'

interface IPivotWrapperProps {
  isActive: boolean
}

const PivotWrapper = styled<IPivotWrapperProps, any>('div')`
  height: 100%;
  font-size: 1.6rem;
  line-height: 4.4rem;
  padding: 0rem 1rem;

  /* padding: 1em; */

  transition: all 0.1s ease-in-out;

  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.2);
  }
  &:active {
    background: rgba(0, 0, 0, 0.4);
  }

  ${props =>
    props.isActive &&
    `
    border-bottom: 2px solid ${props.theme.fg};
    background: rgba(0, 0, 0, 0.3);
  `};
`
export const PivotBar = styled.div`
  height: 100%;
  color: ${props => props.theme.fg};
  display: flex;
  align-items: flex;
`

export const Pivot = ({ children, isActive, onSelect }) => (
  <PivotWrapper isActive={isActive} onClick={onSelect}>
    {children}
  </PivotWrapper>
)
