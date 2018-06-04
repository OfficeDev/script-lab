import * as React from 'react'
import styled from 'styled-components'
// import {
//   Pivot,
//   PivotItem,
//   IPivotStyles,
// } from 'office-ui-fabric-react/lib/Pivot'
// import theme from '../../theme'

import { PivotBar, Pivot } from '../'

const CommandBarWrapper = styled.div`
  grid-area: command-bar;
  background-color: ${props => props.theme.darkAccent};
`

interface IProps {
  fieldNames: string[]
  activeField: string
  changeActiveField: (fieldName: string) => void
}

class CommandBar extends React.Component<IProps> {
  render() {
    const { fieldNames, activeField, changeActiveField } = this.props
    console.log(fieldNames)
    return (
      // todo make fabric control once proper styles is supported
      // <Pivot
      //   selectedKey={activeField}
      //   onLinkClick={this.handleLinkClick}
      //   headersOnly={true}
      //   getTabId={this.getTabId}
      //   // styles={{ root: { color: 'white' } }}
      // >
      //   {fieldNames.map(f => <PivotItem linkText={f} itemKey={f} key={f} />)}
      // </Pivot>
      <CommandBarWrapper>
        <PivotBar>
          {fieldNames.map(fieldName => (
            <Pivot
              key={fieldName}
              isActive={fieldName === activeField}
              onSelect={this.handleLinkClick(fieldName)}
            >
              {fieldName}
            </Pivot>
          ))}
        </PivotBar>
      </CommandBarWrapper>
    )
  }
  private handleLinkClick = (fieldName: string) => () => {
    this.props.changeActiveField(fieldName)
  }
  // private getTabId = (itemKey: string): string => {
  //   return `PivotField_${itemKey}`
  // }

  // private handleLinkClick = (item: PivotItem): void => {
  //   this.props.changeActiveField(item.props.itemKey!)
  // }
}

export default CommandBar
