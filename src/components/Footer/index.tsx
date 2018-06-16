import React from 'react'

import { Wrapper } from './styles'
import { BarButton } from '../'
import FabricIcon from '../FabricIcon'

const Footer = ({ language }) => (
  <Wrapper>
    <BarButton>{language}</BarButton>
    <BarButton>
      <FabricIcon name="Settings" />
    </BarButton>
  </Wrapper>
)

export default Footer
