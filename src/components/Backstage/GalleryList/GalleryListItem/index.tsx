import React, { Component } from 'react'
import { Wrapper, ActiveWrapper, Title, Description } from './styles'

export default ({
  title,
  description,
  isActive,
}: {
  title: string
  description?: string
  isActive?: boolean
}) => {
  const ItemWrapper = isActive ? ActiveWrapper : Wrapper
  return (
    <ItemWrapper>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </ItemWrapper>
  )
}
