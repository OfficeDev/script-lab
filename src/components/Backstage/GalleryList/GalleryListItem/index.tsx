import React, { Component } from 'react'
import { Wrapper, Title, Description } from './styles'

export default ({ title, description }: { title: string; description?: string }) => (
  <Wrapper>
    <Title>{title}</Title>
    <Description>{description}</Description>
  </Wrapper>
)
