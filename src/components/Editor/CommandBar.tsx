import React from 'react'
import styled from 'styled-components'
// import {
//   Pivot,
//   PivotItem,
//   IPivotStyles,
// } from 'office-ui-fabric-react/lib/Pivot'
// import theme from '../../theme'

import { PivotBar, Pivot } from '../'
import { ISnippetFile } from '../../interfaces'

const CommandBarWrapper = styled.div`
  grid-area: command-bar;
  background-color: ${props => props.theme.darkAccent};
`

interface IProps {
  fields: ISnippetFile[]
  activeField: ISnippetFile
  changeActiveField: (field: ISnippetFile) => void
}

class CommandBar extends React.Component<IProps> {
  render() {
    const { fields, activeField, changeActiveField } = this.props
    console.log(fields)
    const activeFieldName = activeField ? activeField.name : ''

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
          {fields.map(field => (
            <Pivot
              key={field.name}
              isActive={field.name === activeFieldName}
              onSelect={this.handleLinkClick(field)}
            >
              {field.name}
            </Pivot>
          ))}
        </PivotBar>
      </CommandBarWrapper>
    )
  }
  private handleLinkClick = (field: ISnippetFile) => () => {
    this.props.changeActiveField(field)
  }
  // private getTabId = (itemKey: string): string => {
  //   return `PivotField_${itemKey}`
  // }

  // private handleLinkClick = (item: PivotItem): void => {
  //   this.props.changeActiveField(item.props.itemKey!)
  // }
}

export default CommandBar
