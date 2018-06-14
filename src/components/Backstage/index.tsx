import React, { Component } from 'react'
import { BackstageWrapper, NavMenu, NavMenuItem, ContentWrapper } from './styles'
import MySolutions from './MySolutions'
import FabricIcon from '../FabricIcon'
// TODO: refactor to using Fabric Pivot, but due to styling issues, can't currently do that.

interface IState {
  selectedLabel: string
  activeContent?: JSX.Element
}
// TODO: figure out how this data will be fetched and piped through
export default class Backstage extends Component<{}, IState> {
  state = { selectedLabel: 'My Snippets', activeContent: undefined }
  menuItems

  constructor(props) {
    super(props)

    this.menuItems = [
      {
        icon: <FabricIcon name="GlobalNavButton" />,
        onSelect: () => alert('closing backstage'),
      },
      {
        icon: <FabricIcon name="Add" />,
        label: 'New Snippet',
        onSelect: () => alert('creating new snippet'),
      },
      {
        icon: <FabricIcon name="DocumentSet" />,
        label: 'My Snippets',
        onSelect: () =>
          this.setState({ selectedLabel: 'My Snippets', activeContent: <MySolutions /> }),
      },
      {
        icon: <FabricIcon name="Dictionary" />,
        label: 'Samples',
        onSelect: () =>
          this.setState({ selectedLabel: 'Samples', activeContent: <MySolutions /> }),
      },
      {
        icon: <FabricIcon name="Download" />,
        label: 'Import',
        onSelect: () =>
          this.setState({ selectedLabel: 'Import', activeContent: <MySolutions /> }),
      },
    ]
  }
  render() {
    const { selectedLabel, activeContent } = this.state
    return (
      <BackstageWrapper>
        <NavMenu>
          {this.menuItems.map(item => (
            <NavMenuItem
              key={item.label}
              onSelect={item.onSelect}
              isSelected={selectedLabel === item.label}
            >
              {item.icon}
              {item.label && <span>{item.label}</span>}
            </NavMenuItem>
          ))}
        </NavMenu>
        {activeContent}
      </BackstageWrapper>
    )
  }
}
