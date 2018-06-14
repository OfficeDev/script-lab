import React from 'react'
import { PivotItemWrapper, SelectedPivotItemWrapper, Pivot } from './styles'

interface IPivotItem {
  isSelected: boolean
  onSelect: () => void
  children: any
  className?: string
}

export const PivotItem = ({ isSelected, onSelect, children, className }: IPivotItem) => {
  const Wrapper = isSelected ? SelectedPivotItemWrapper : PivotItemWrapper
  return (
    <Wrapper className={className} onClick={onSelect}>
      {children}
    </Wrapper>
  )
}

export { Pivot }
