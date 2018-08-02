import React from 'react'

import { Wrapper } from './styles'
import BarButton from '../BarButton'
import FabricIcon from '../FabricIcon'

const languageMap = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  css: 'CSS',
  html: 'HTML',
}

const Footer = ({ language }: { language: string }) => (
  <Wrapper>
    {languageMap[language.toLowerCase()] && (
      <BarButton>{languageMap[language.toLowerCase()]}</BarButton>
    )}
    <BarButton>
      <FabricIcon name="Settings" />
    </BarButton>
  </Wrapper>
)

export default Footer
