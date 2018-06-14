import React, { Component } from 'react'
import { BackstageWrapper, NavMenu, NavMenuItem, ContentWrapper } from './styles'
import MySolutions from './MySolutions'
import FabricIcon from '../FabricIcon'
// TODO: refactor to using Fabric Pivot, but due to styling issues, can't currently do that.

interface IBackstageItem {
  key: string
  icon: JSX.Element
  label?: string
  onSelect?: () => void
  content?: JSX.Element
}

interface IState {
  selectedKey: string
  items: IBackstageItem[]
}

// TODO: figure out how this data will be fetched and piped through
export default class Backstage extends Component<{}, IState> {
  state = {
    selectedKey: 'my-solutions',
    items: [
      {
        key: 'back',
        icon: <FabricIcon name="GlobalNavButton" />,
        onSelect: () => alert('closing backstage'),
      },
      {
        key: 'new',
        icon: <FabricIcon name="Add" />,
        label: 'New Snippet',
        onSelect: () => alert('creating new snippet'),
      },
      {
        key: 'my-solutions',
        icon: <FabricIcon name="DocumentSet" />,
        label: 'My Snippets',
        content: <MySolutions />,
      },
      {
        key: 'samples',
        icon: <FabricIcon name="Dictionary" />,
        label: 'Samples',
        content: <MySolutions />,
      },
      {
        key: 'import',
        icon: <FabricIcon name="Download" />,
        label: 'Import',
        content: <MySolutions />,
      },
    ].map((item: IBackstageItem) => ({
      onSelect: () => this.setState({ selectedKey: item.key }),
      ...item,
    })),
  }

  constructor(props) {
    super(props)
  }
  render() {
    const { selectedKey, items } = this.state
    console.log(selectedKey, items)
    const activeItem = items.find(item => item.key === selectedKey)
    console.log(activeItem)
    return (
      <BackstageWrapper>
        <NavMenu>
          {this.state.items.map(item => (
            <NavMenuItem
              key={item.key}
              onSelect={item.onSelect}
              isSelected={selectedKey === item.key}
            >
              {item.icon}
              {item.label && <span>{item.label}</span>}
            </NavMenuItem>
          ))}
        </NavMenu>
        {activeItem && activeItem.content}
      </BackstageWrapper>
    )
  }
}
