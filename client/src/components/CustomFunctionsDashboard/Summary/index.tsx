import React from 'react'

import SummaryItem from './SummaryItem'
import {
  CustomFunctionsTitle,
  CustomFunctionsDescription,
  SummaryItemsContainer,
} from './styles'
import { connect } from 'react-redux'
import selectors from '../../../store/selectors'

interface IPropsFromRedux {
  items: ICustomFunctionSummaryItem[]
}

const mapStateToProps = (state): IPropsFromRedux => ({
  items: selectors.customFunctions.getMetadataSummaryItems(state),
})

export interface ISummary {
  items: ICustomFunctionSummaryItem[]
}

export const Summary = ({ items }: ISummary) => {
  const hasErrors = items.filter(item => item.status === 'error').length > 0

  const description = hasErrors
    ? 'Some of your functions are invalid and cannot be declared. Review and fix the issues.'
    : 'The following functions have been registered successfully.'

  return (
    <div>
      <CustomFunctionsTitle>Custom Functions (Preview)</CustomFunctionsTitle>
      <CustomFunctionsDescription>{description}</CustomFunctionsDescription>
      <SummaryItemsContainer>
        {items.map(item => (
          <SummaryItem key={`${item.snippetName}${item.funcName}`} {...item} />
        ))}
      </SummaryItemsContainer>
    </div>
  )
}

export default connect(mapStateToProps)(Summary)
