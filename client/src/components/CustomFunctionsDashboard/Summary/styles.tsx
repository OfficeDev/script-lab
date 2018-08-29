import styled from 'styled-components'

export const CustomFunctionsTitle = styled.h1.attrs({ className: 'ms-font-xl' })`
  margin: 2.3rem 1.7rem 0rem 1.7rem;
`

export const CustomFunctionsDescription = styled.h4.attrs({ className: 'ms-font-s' })`
  margin: 1.1rem 1.7rem 0rem 1.7rem;
`

export const SummaryItemsContainer = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.neutralLight};
  border-bottom: 1px solid ${props => props.theme.neutralLight};
`
