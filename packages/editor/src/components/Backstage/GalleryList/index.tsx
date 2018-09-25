import React, { Component } from 'react'
import { GalleryListWrapper, TitleBar, Title, ArrowWrapper } from './styles'

import { FocusZone } from 'office-ui-fabric-react/lib/FocusZone'
import { Icon } from 'office-ui-fabric-react/lib/Icon'

import GalleryListItem, { IGalleryListItem } from './GalleryListItem'
import Only from '../../Only'

export interface IProps {
  title: string
  items: IGalleryListItem[]
}

interface IState {
  isExpanded: boolean
}

class GalleryList extends Component<IProps, IState> {
  state = { isExpanded: true }

  constructor(props) {
    super(props)
  }

  toggleExpansion = () => this.setState({ isExpanded: !this.state.isExpanded })

  render() {
    const { title, items } = this.props
    const { isExpanded } = this.state
    return (
      <GalleryListWrapper>
        <FocusZone>
          <TitleBar>
            <Title>{title}</Title>
            <ArrowWrapper onClick={this.toggleExpansion} data-is-focusable={true}>
              <Icon iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'} />
            </ArrowWrapper>
          </TitleBar>
          <Only when={isExpanded}>
            {items.map(item => <GalleryListItem key={item.key} {...item} />)}
          </Only>
        </FocusZone>
      </GalleryListWrapper>
    )
  }
}

export default GalleryList
