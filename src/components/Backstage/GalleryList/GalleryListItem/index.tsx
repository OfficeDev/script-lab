import React, { Component } from 'react'
import { Wrapper, Title, Description } from './styles'

export default ({ title, description }) => (
  <Wrapper>
    <Title>{title}</Title>
    <Description>{description}</Description>
  </Wrapper>
)
