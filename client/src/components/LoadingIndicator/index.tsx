import React from 'react'
import { LoadingBar, Ball } from './styles'

const LoadingIndicator = ({ numBalls, ballSize, ballColor, delay = 0.16 }) => (
  <LoadingBar style={{ height: `${ballSize}px` }}>
    {Array.from({ length: numBalls }, (v, k) => (
      <Ball
        key={`ball-${k}`}
        style={{
          animationDelay: `-${delay * (numBalls - k)}s`,
          height: `${ballSize}px`,
          width: `${ballSize}px`,
          backgroundColor: ballColor,
        }}
      />
    ))}
  </LoadingBar>
)

export default LoadingIndicator
