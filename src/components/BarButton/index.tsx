import React from 'react'
import styled from 'styled-components'

const BarButton = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;

  height: 100%;

  padding: 0em 1.2rem;

  border: 0;

  background: none;
  color: white;

  transition: all 0.1s ease-in-out;

  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.2);
  }
  &:active {
    background: rgba(0, 0, 0, 0.4);
  }

  & > i {
    margin-right: 0.6rem;
  }

  & > i:last-child {
    margin-right: 0;
  }
`

export default BarButton
