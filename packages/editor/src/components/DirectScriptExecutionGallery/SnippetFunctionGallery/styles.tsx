import styled from 'styled-components'

export const FunctionName = styled.h2.attrs({ className: 'ms-font-l' })``

export const FunctionWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
`

export const FunctionList = styled.div`
  overflow-y: auto;
  height: 100%;
  & ${FunctionWrapper} {
    margin-bottom: 1rem;
    box-sizing: border-box;
  }
`
