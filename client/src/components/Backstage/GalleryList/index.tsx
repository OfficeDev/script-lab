import React, { Component } from 'react'
import { withTheme } from 'styled-components'
import ReactDOM from 'react-dom'
import { GalleryListWrapper, TitleBar, Title, ArrowWrapper } from './styles'
import { FocusZone } from 'office-ui-fabric-react/lib/FocusZone'

import GalleryListItem, { IGalleryListItem } from './GalleryListItem'
import FabricIcon from '../../FabricIcon'
import Only from '../../Only'

export interface IProps {
  title: string
  items: IGalleryListItem[]
  theme: ITheme // from withTheme
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
    const { title, items, theme } = this.props
    const { isExpanded } = this.state
    return (
      <GalleryListWrapper>
        <FocusZone>
          <TitleBar>
            <Title>{title}</Title>
            <ArrowWrapper onClick={this.toggleExpansion} data-is-focusable="true">
              <FabricIcon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} />
            </ArrowWrapper>
          </TitleBar>
          <Only when={isExpanded}>
            {items.map(item => (
              <GalleryListItem key={item.key} {...item} />
            ))}
          </Only>
        </FocusZone>
      </GalleryListWrapper>
    )
  }
}

export default withTheme(GalleryList)
