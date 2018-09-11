import React from 'react'
import { CenteringContainer, BallContainer, Ball } from './styles'

const LoadingIndicator = ({ numBalls, ballSize, ballColor, delay = 0.16 }) => (
  <CenteringContainer>
    <BallContainer style={{ height: `${ballSize}px` }}>
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
    </BallContainer>
  </CenteringContainer>
)

export default LoadingIndicator
