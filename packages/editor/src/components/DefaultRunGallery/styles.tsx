import styled from 'styled-components'

export const RunButton = styled.a`
  width: 2rem;
  height: 2rem;
  margin-right: 1rem;
  border-style: solid;
  border-width: 1rem 0px 1rem 2rem;
  border-color: transparent transparent transparent green;
`

export const FunctionName = styled.h2.attrs({ className: 'ms-font-xl' })`
  line-height: 2rem;
`

export const FunctionWrapper = styled.div`
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
