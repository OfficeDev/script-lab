import React from 'react'
import styled, { keyframes } from 'styled-components'
import { execFile } from 'child_process'

export const LoadingBar = styled.div``

const MovingBalls = keyframes`
  0%, 80%, 100% {
      transform: scale(0);
  }
  40% {
      transform: scale(1);
  }
`

export const Ball = styled.div`
  margin: 4px;
  border-radius: 100%;
  display: inline-block;
  animation: ${MovingBalls} 1.4s infinite ease-in-out both;
  ${MovingBalls};
`
