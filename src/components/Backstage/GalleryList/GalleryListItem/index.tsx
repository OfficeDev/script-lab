import React from 'react'
import { Wrapper, ActiveWrapper, Title, Description } from './styles'

export interface IGalleryListItem {
  key: string
  title: string
  description?: string
  isActive?: boolean
  onClick?: () => void
}

const GalleryListItem = ({ title, description, isActive, onClick }: IGalleryListItem) => {
  const ItemWrapper = isActive ? ActiveWrapper : Wrapper
  return (
    <ItemWrapper onClick={onClick}>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </ItemWrapper>
  )
}

export default GalleryListItem
