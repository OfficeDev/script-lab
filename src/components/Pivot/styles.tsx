import React from 'react'
import styled from 'styled-components'

export const PivotItemWrapper = styled.div`
  height: 100%;
  font-size: 1.4rem;
  line-height: 4rem;
  padding: 0rem 1rem;

  transition: background 0.1s ease-in-out;

  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.2);
  }
  &:active {
    background: rgba(0, 0, 0, 0.4);
  }
`

export const SelectedPivotItemWrapper = PivotItemWrapper.extend`
  border-bottom: 2px solid ${props => props.theme.fg};
  background: rgba(0, 0, 0, 0.3);
`

export const Pivot = styled.div`
  height: 100%;
  color: ${props => props.theme.fg};
  display: flex;
  align-items: flex;
`
