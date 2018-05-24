import * as React from 'react'
import styled from 'styled-components'

const RunButton = styled.a`
  width: 2rem;
  height: 2rem;
  margin-right: 1rem;
  border-style: solid;
  border-width: 1rem 0px 1rem 2rem;
  border-color: transparent transparent transparent green;
`

const FunctionName = styled.h2`
  line-height: 2rem;
`

const FunctionWrapper = styled.div`
  display: flex;
  align-items: center;

  border: 0.1rem solid gray;
  padding: 2rem;

  background-color: papayawhip;
`

export const RunPane = styled.div`
  overflow-y: auto;

  height: 100%;
  padding: 4rem;

  & ${FunctionWrapper} {
    margin-bottom: 4rem;
  }
`

export const Function = ({ name }) => (
  <FunctionWrapper>
    <RunButton />
    <FunctionName>{name}</FunctionName>
  </FunctionWrapper>
)
