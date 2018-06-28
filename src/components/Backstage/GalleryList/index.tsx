import React, { Component } from 'react'
import { GalleryListWrapper, TitleBar, Title, ArrowWrapper } from './styles'

import GalleryListItem, { IGalleryListItem } from './GalleryListItem'
import FabricIcon from '../../FabricIcon'

export interface IGalleryList {
  title: string
  items: IGalleryListItem[]
}

interface IGalleryListState {
  isExpanded: boolean
}

export default class GalleryList extends Component<IGalleryList, IGalleryListState> {
  state = { isExpanded: true }

  toggleExpansion = () => this.setState({ isExpanded: !this.state.isExpanded })

  render() {
    const { title, items } = this.props
    const { isExpanded } = this.state
    return (
      <GalleryListWrapper>
        <TitleBar>
          <Title>{title}</Title>
          <ArrowWrapper onClick={this.toggleExpansion}>
            <FabricIcon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} />
          </ArrowWrapper>
        </TitleBar>
        {isExpanded && items.map(item => <GalleryListItem key={item.key} {...item} />)}
      </GalleryListWrapper>
    )
  }
}
