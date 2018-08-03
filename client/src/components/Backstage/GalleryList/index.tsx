import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { GalleryListWrapper, TitleBar, Title, ArrowWrapper } from './styles'

import GalleryListItem, { IGalleryListItem } from './GalleryListItem'
import FabricIcon from '../../FabricIcon'

export interface IGalleryList {
  title: string
  items: any
}

interface IGalleryListState {
  isExpanded: boolean
  focusedItemIndex: number | null
}

export default class GalleryList extends Component<IGalleryList, IGalleryListState> {
  state = { isExpanded: true, focusedItemIndex: null }

  constructor(props) {
    super(props)
  }

  toggleExpansion = () => this.setState({ isExpanded: !this.state.isExpanded })

  onKeyDown = e => {
    const index = this.state.focusedItemIndex
    console.log({ keyCode: e.keyCode, index })
    if (e.keyCode === 38) {
      const newIndex = index !== null ? index - 1 : 0
      this.setState({ focusedItemIndex: Math.max(0, newIndex) })
    } else if (e.keyCode === 40) {
      const newIndex = index !== null ? index + 1 : 0
      this.setState({
        focusedItemIndex: Math.min(this.props.items.length - 1, newIndex),
      })
    } else if (e.keyCode === 9) {
      this.setState({ focusedItemIndex: null })
    } else if (e.keyCode === 32) {
      if (index !== null) {
        this.props.items[index].onClick()
      }
    }
    this.forceUpdate()
  }

  focusRef = ref => console.log(ref)

  componentDidUpdate() {
    const ref = ReactDOM.findDOMNode(this.refs.thisDiv) as any
    if (ref) {
      ref.focus()
    }
  }

  render() {
    const { title, items } = this.props
    const { isExpanded } = this.state
    return (
      <GalleryListWrapper tabIndex={0} onKeyDown={this.onKeyDown}>
        <TitleBar>
          <Title>{title}</Title>
          <ArrowWrapper onClick={this.toggleExpansion}>
            <FabricIcon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} />
          </ArrowWrapper>
        </TitleBar>
        {isExpanded &&
          items.map((item, i) => {
            return this.state.focusedItemIndex === i ? (
              <div
                ref="thisDiv"
                tabIndex={0}
                key={item.key}
                style={{ color: 'white', backgroundColor: '#217346' }}
              >
                <GalleryListItem {...item} />
              </div>
            ) : (
              <GalleryListItem key={item.key} {...item} />
            )
          })}
      </GalleryListWrapper>
    )
  }
}
