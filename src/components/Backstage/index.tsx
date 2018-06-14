import React, { Component } from 'react'
import { BackstageWrapper, NavMenu, NavMenuItem, ContentWrapper } from './styles'
import MySolutions from './MySolutions'
// TODO: refactor to using Fabric Pivot, but due to styling issues, can't currently do that.

const BackStagePivotData = [
  {
    label: 'New Snippet',
    onSelect: () => console.log('Selected New Snippet'),
  },
  {
    label: 'My Snippets',
    onSelect: () => console.log('Selected My Snippets'),
  },
  {
    label: 'Samples',
    onSelect: () => console.log('Selected Samples'),
  },
  {
    label: 'Import',
    onSelect: () => console.log('Selected Import'),
  },
]

interface IState {
  selectedLabel?: string
}

export default class Backstage extends Component<{}, IState> {
  state = { selectedLabel: undefined }
  render() {
    const { selectedLabel } = this.state
    return (
      <BackstageWrapper>
        <NavMenu>
          {BackStagePivotData.map(item => (
            <NavMenuItem
              key={item.label}
              onSelect={item.onSelect}
              isSelected={selectedLabel === item.label}
            >
              {item.label}
            </NavMenuItem>
          ))}
        </NavMenu>
        <MySolutions />
      </BackstageWrapper>
    )
  }
}
