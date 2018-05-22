import * as React from 'react'
import styled from 'styled-components'

import { Bar } from '../'

const HeaderWrapper = styled(Bar)`
  background: green;
`

const Header = props => <HeaderWrapper>Header</HeaderWrapper>

export default Header
