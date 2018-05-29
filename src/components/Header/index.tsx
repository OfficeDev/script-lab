import * as React from 'react'
import styled from 'styled-components'

import { BarButton, FabricIcon, Label, UserPresence } from '../'

const HeaderWrapper = styled.header.attrs({ className: 'ms-font-l' })`
  grid-area: header;

  display: flex;
  align-items: center;

  background: ${props => props.theme.accent};
`

const Header = props => (
  <HeaderWrapper>
    <BarButton>
      <FabricIcon name="GlobalNavButton" />
    </BarButton>
    <BarButton>
      <Label>Snippet Name</Label>
    </BarButton>
    <BarButton>
      <FabricIcon name="Play" />
      <Label>Run</Label>
    </BarButton>
    <BarButton>
      <FabricIcon name="Share" />
      <Label>Share</Label>
    </BarButton>
    <BarButton>
      <FabricIcon name="Delete" />
      <Label>Delete</Label>
    </BarButton>
    <UserPresence />
  </HeaderWrapper>
)

export default Header
