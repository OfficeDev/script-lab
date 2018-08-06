import React from 'react'

import { Wrapper } from './styles'
import BarButton from '../BarButton'
import FabricIcon from '../FabricIcon'

const languageMap = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
}

const Footer = ({
  language,
  onSettingsIconClick,
}: {
  language: string
  onSettingsIconClick: () => void
}) => (
  <Wrapper>
    {languageMap[language.toLowerCase()] && (
      <BarButton>{languageMap[language.toLowerCase()]}</BarButton>
    )}
    <BarButton onClick={onSettingsIconClick}>
      <FabricIcon name="Settings" />
    </BarButton>
  </Wrapper>
)

export default Footer
